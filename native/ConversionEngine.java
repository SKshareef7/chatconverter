package com.chatconvert.keyboard;

import java.util.LinkedHashMap;
import java.util.Map;

final class ConversionEngine {
    interface RemoteCallback {
        void onResult(ConversionResult result);
    }

    private final TranslationProvider provider;
    private final RemoteTranslationProvider remoteProvider;

    ConversionEngine(android.content.Context context) {
        provider = new LocalTranslationProvider();
        remoteProvider = new RemoteTranslationProvider(context);
    }

    ConversionResult convert(String source) {
        String cleanSource = source == null ? "" : source.trim();
        Map<String, String> values = provider.translate(cleanSource);
        return new ConversionResult(
            cleanSource,
            values.get("Telugu"),
            values.get("Hindi")
        );
    }

    void translateRemotely(String source, RemoteCallback callback) {
        remoteProvider.translateAsync(source, values -> {
            if (values == null) return;
            callback.onResult(new ConversionResult(
                source,
                values.get("Telugu"),
                values.get("Hindi")
            ));
        });
    }

    static String normalize(String value) {
        return value == null
            ? ""
            : value.trim().toLowerCase().replaceAll("[?!.,]+$", "");
    }

    static final class ConversionResult {
        final String source;
        final String telugu;
        final String hindi;

        ConversionResult(String source, String telugu, String hindi) {
            this.source = source;
            this.telugu = telugu;
            this.hindi = hindi;
        }
    }
}