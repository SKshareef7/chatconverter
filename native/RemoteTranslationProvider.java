package com.chatconvert.keyboard;

import android.content.Context;
import android.text.TextUtils;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Optional second-level provider. It is disabled when the endpoint resource is
 * empty, which is the default. Configure CHATCONVERT_TRANSLATION_API_URL at
 * prebuild time to point to a server-side proxy that owns the provider key.
 */
final class RemoteTranslationProvider {
    interface Callback {
        void onResult(Map<String, String> values);
    }

    private final String endpoint;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    RemoteTranslationProvider(Context context) {
        int resourceId = context.getResources().getIdentifier(
            "chatconvert_translation_api_url",
            "string",
            context.getPackageName()
        );
        endpoint = resourceId == 0 ? "" : context.getString(resourceId);
    }

    void translateAsync(String source, Callback callback) {
        if (TextUtils.isEmpty(endpoint)) return;
        executor.execute(() -> {
            Map<String, String> values = request(source);
            if (values != null) callback.onResult(values);
        });
    }

    private Map<String, String> request(String source) {
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(endpoint).openConnection();
            connection.setRequestMethod("POST");
            connection.setConnectTimeout(4500);
            connection.setReadTimeout(4500);
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/json");

            JSONObject body = new JSONObject();
            body.put("text", source);
            try (OutputStream output = connection.getOutputStream()) {
                output.write(body.toString().getBytes(StandardCharsets.UTF_8));
            }

            if (connection.getResponseCode() < 200 || connection.getResponseCode() >= 300) {
                return null;
            }
            String response = read(connection.getInputStream());
            JSONObject json = new JSONObject(response);
            String telugu = json.optString("telugu", "");
            String hindi = json.optString("hindi", "");
            if (TextUtils.isEmpty(telugu) || TextUtils.isEmpty(hindi)) return null;

            Map<String, String> values = new LinkedHashMap<>();
            values.put("Telugu", telugu);
            values.put("Hindi", hindi);
            return values;
        } catch (Exception ignored) {
            return null;
        } finally {
            if (connection != null) connection.disconnect();
        }
    }

    private String read(InputStream input) throws Exception {
        StringBuilder value = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(input, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) value.append(line);
        }
        return value.toString();
    }
}