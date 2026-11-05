package com.chatconvert.keyboard;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.inputmethodservice.InputMethodService;
import android.provider.Settings;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputConnection;
import android.widget.Button;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import java.util.Arrays;
import java.util.List;

public class ChatConvertInputMethodService extends InputMethodService {
    private ChatConvertKeyboardView keyboardView;
    private final StringBuilder typedBuffer = new StringBuilder();

    @Override
    public View onCreateInputView() {
        keyboardView = new ChatConvertKeyboardView(this);
        return keyboardView;
    }

    @Override
    public void onStartInput(android.view.inputmethod.EditorInfo attribute, boolean restarting) {
        super.onStartInput(attribute, restarting);
        typedBuffer.setLength(0);
        if (keyboardView != null) {
            keyboardView.resetConversion();
        }
    }

    void typeCharacter(String value) {
        InputConnection connection = getCurrentInputConnection();
        if (connection == null) return;
        connection.commitText(value, 1);
        typedBuffer.append(value);
    }

    void typeSpace() {
        typeCharacter(" ");
    }

    void deleteCharacter() {
        InputConnection connection = getCurrentInputConnection();
        if (connection == null) return;
        connection.deleteSurroundingText(1, 0);
        if (typedBuffer.length() > 0) {
            typedBuffer.deleteCharAt(typedBuffer.length() - 1);
        }
    }

    void pressEnter() {
        InputConnection connection = getCurrentInputConnection();
        if (connection == null) return;
        connection.sendKeyEvent(new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_ENTER));
        connection.sendKeyEvent(new KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_ENTER));
        typedBuffer.setLength(0);
    }

    String textForConversion() {
        String typed = typedBuffer.toString().trim();
        if (!typed.isEmpty()) return typed;

        InputConnection connection = getCurrentInputConnection();
        if (connection == null) return "";
        CharSequence beforeCursor = connection.getTextBeforeCursor(200, 0);
        return beforeCursor == null ? "" : beforeCursor.toString().trim();
    }

    void insertConversion(String source, String result) {
        InputConnection connection = getCurrentInputConnection();
        if (connection == null || result == null || result.trim().isEmpty()) return;
        int replaceLength = typedBuffer.length() > 0
            ? typedBuffer.length()
            : source.length();
        connection.deleteSurroundingText(replaceLength, 0);
        connection.commitText(result, 1);
        typedBuffer.setLength(0);
        typedBuffer.append(result);
    }

    void openKeyboardSettings() {
        try {
            Intent intent = new Intent(Settings.ACTION_INPUT_METHOD_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        } catch (Exception ignored) {
            Intent intent = new Intent(Settings.ACTION_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        }
    }

    private static int dp(Context context, int value) {
        return Math.round(value * context.getResources().getDisplayMetrics().density);
    }

    private static GradientDrawable rounded(int color, int radius) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(color);
        drawable.setCornerRadius(radius);
        return drawable;
    }

    private static final int NAVY = Color.rgb(7, 24, 61);
    private static final int NAVY_LIGHT = Color.rgb(19, 43, 82);
    private static final int TEAL = Color.rgb(17, 211, 204);
    private static final int TEAL_DARK = Color.rgb(14, 151, 147);
    private static final int PAPER = Color.rgb(244, 247, 250);
    private static final int KEY = Color.rgb(255, 255, 255);
    private static final int TEXT = Color.rgb(28, 43, 62);
    private static final int MUTED = Color.rgb(102, 120, 139);
    private static final int CORAL = Color.rgb(255, 115, 93);

    private final class ChatConvertKeyboardView extends LinearLayout {
        private final LinearLayout resultArea;
        private final LinearLayout keyArea;
        private final ConversionEngine engine = new ConversionEngine(ChatConvertInputMethodService.this);
        private boolean shifted;
        private boolean symbols;
        private String lastSource = "";

        ChatConvertKeyboardView(Context context) {
            super(context);
            setOrientation(VERTICAL);
            setBackgroundColor(PAPER);
            setPadding(dp(context, 8), dp(context, 6), dp(context, 8), dp(context, 5));

            LinearLayout toolbar = new LinearLayout(context);
            toolbar.setGravity(Gravity.CENTER_VERTICAL);
            toolbar.setPadding(dp(context, 2), 0, dp(context, 2), dp(context, 5));
            addView(toolbar, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(context, 42)
            ));

            TextView brand = label("ChatConvert", 14, Color.WHITE, Typeface.BOLD);
            brand.setGravity(Gravity.CENTER_VERTICAL);
            brand.setPadding(dp(context, 10), 0, dp(context, 10), 0);
            brand.setBackground(rounded(NAVY, dp(context, 12)));
            toolbar.addView(brand, new LinearLayout.LayoutParams(0, -1, 1.25f));

            Button convert = toolbarButton("Convert", TEAL, NAVY);
            convert.setOnClickListener(view -> convertText());
            toolbar.addView(convert, buttonParams(context, 0.9f));

            Button settings = toolbarButton("Settings", NAVY_LIGHT, Color.WHITE);
            settings.setOnClickListener(view -> openKeyboardSettings());
            toolbar.addView(settings, buttonParams(context, 0.85f));

            resultArea = new LinearLayout(context);
            resultArea.setOrientation(VERTICAL);
            resultArea.setPadding(dp(context, 10), dp(context, 7), dp(context, 10), dp(context, 7));
            resultArea.setBackground(rounded(Color.WHITE, dp(context, 14)));
            addView(resultArea, new LinearLayout.LayoutParams(-1, dp(context, 94)));
            showEmptyResult();

            keyArea = new LinearLayout(context);
            keyArea.setOrientation(VERTICAL);
            addView(keyArea, new LinearLayout.LayoutParams(-1, 0, 1));
            renderKeys();
        }

        private LinearLayout.LayoutParams buttonParams(Context context, float weight) {
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, -1, weight);
            params.setMargins(dp(context, 3), 0, dp(context, 0), 0);
            return params;
        }

        private TextView label(String text, int size, int color, int style) {
            TextView view = new TextView(ChatConvertInputMethodService.this);
            view.setText(text);
            view.setTextSize(size);
            view.setTextColor(color);
            view.setTypeface(Typeface.DEFAULT, style);
            return view;
        }

        private Button toolbarButton(String text, int background, int foreground) {
            Button button = new Button(ChatConvertInputMethodService.this);
            button.setText(text);
            button.setTextSize(11);
            button.setTextColor(foreground);
            button.setAllCaps(false);
            button.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
            button.setGravity(Gravity.CENTER);
            button.setPadding(dp(ChatConvertInputMethodService.this, 3), 0, dp(ChatConvertInputMethodService.this, 3), 0);
            button.setBackground(rounded(background, dp(ChatConvertInputMethodService.this, 12)));
            return button;
        }

        private void convertText() {
            String source = textForConversion();
            if (source.isEmpty()) {
                showMessage("Type an English word or sentence first.");
                return;
            }
            lastSource = source;
            ConversionEngine.ConversionResult conversion = engine.convert(source);
            showConversion(conversion);
            engine.translateRemotely(source, remoteResult -> post(() -> {
                if (source.equals(lastSource)) {
                    showConversion(remoteResult);
                }
            }));
        }

        private void showEmptyResult() {
            resultArea.removeAllViews();
            TextView hint = label("Type in English, then tap Convert", 13, MUTED, Typeface.BOLD);
            hint.setGravity(Gravity.CENTER_VERTICAL);
            resultArea.addView(hint, new LinearLayout.LayoutParams(-1, -1));
        }

        private void showMessage(String message) {
            resultArea.removeAllViews();
            TextView hint = label(message, 12, CORAL, Typeface.BOLD);
            hint.setGravity(Gravity.CENTER_VERTICAL);
            resultArea.addView(hint, new LinearLayout.LayoutParams(-1, -1));
        }

        private void showConversion(ConversionEngine.ConversionResult conversion) {
            resultArea.removeAllViews();
            LinearLayout header = new LinearLayout(ChatConvertInputMethodService.this);
            header.setGravity(Gravity.CENTER_VERTICAL);
            TextView english = label("English  ", 11, MUTED, Typeface.BOLD);
            TextView source = label(conversion.source, 13, TEXT, Typeface.BOLD);
            header.addView(english);
            header.addView(source, new LinearLayout.LayoutParams(0, -1, 1));
            resultArea.addView(header, new LinearLayout.LayoutParams(-1, dp(ChatConvertInputMethodService.this, 23)));

            LinearLayout choices = new LinearLayout(ChatConvertInputMethodService.this);
            choices.setGravity(Gravity.CENTER_VERTICAL);
            addResultChoice(choices, "Telugu", conversion.telugu);
            addResultChoice(choices, "Hindi", conversion.hindi);
            resultArea.addView(choices, new LinearLayout.LayoutParams(-1, 0, 1));
        }

        private void addResultChoice(LinearLayout parent, String language, String value) {
            Button button = toolbarButton(language + ": " + value, language.equals("Telugu") ? TEAL : NAVY, language.equals("Telugu") ? NAVY : Color.WHITE);
            button.setTextSize(11);
            button.setOnClickListener(view -> insertConversion(lastSource, value));
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, -1, 1);
            params.setMargins(dp(ChatConvertInputMethodService.this, 2), 0, dp(ChatConvertInputMethodService.this, 2), 0);
            parent.addView(button, params);
        }

        void resetConversion() {
            lastSource = "";
            if (resultArea != null) showEmptyResult();
        }

        private void renderKeys() {
            keyArea.removeAllViews();
            List<String[]> rows = symbols
                ? Arrays.asList(
                    new String[]{"1", "2", "3", "4", "5", "6", "7", "8", "9", "0"},
                    new String[]{"@", "#", "$", "%", "&", "*", "(", ")", "-", "_"},
                    new String[]{"!", "?", "'", "\"", ":", ";", "/", "+", "=", "."}
                )
                : Arrays.asList(
                    new String[]{"q", "w", "e", "r", "t", "y", "u", "i", "o", "p"},
                    new String[]{"a", "s", "d", "f", "g", "h", "j", "k", "l"},
                    new String[]{"z", "x", "c", "v", "b", "n", "m"}
                );

            for (String[] row : rows) {
                LinearLayout line = new LinearLayout(ChatConvertInputMethodService.this);
                line.setGravity(Gravity.CENTER);
                for (String key : row) {
                    String display = shifted && !symbols ? key.toUpperCase() : key;
                    Button button = keyButton(display);
                    button.setOnClickListener(view -> typeCharacter(display));
                    line.addView(button, new LinearLayout.LayoutParams(0, -1, 1));
                }
                LinearLayout.LayoutParams lineParams = new LinearLayout.LayoutParams(-1, 0, 1);
                lineParams.setMargins(0, dp(ChatConvertInputMethodService.this, 2), 0, 0);
                keyArea.addView(line, lineParams);
            }

            LinearLayout controls = new LinearLayout(ChatConvertInputMethodService.this);
            controls.setGravity(Gravity.CENTER);
            Button symbolsButton = keyButton(symbols ? "ABC" : "?123");
            symbolsButton.setOnClickListener(view -> {
                symbols = !symbols;
                renderKeys();
            });
            controls.addView(symbolsButton, new LinearLayout.LayoutParams(0, -1, 1.25f));

            if (!symbols) {
                Button shiftButton = keyButton(shifted ? "SHIFT" : "shift");
                shiftButton.setOnClickListener(view -> {
                    shifted = !shifted;
                    renderKeys();
                });
                controls.addView(shiftButton, new LinearLayout.LayoutParams(0, -1, 1.45f));
            }

            Button spaceButton = keyButton("space");
            spaceButton.setOnClickListener(view -> typeSpace());
            controls.addView(spaceButton, new LinearLayout.LayoutParams(0, -1, 3.15f));

            Button backspaceButton = keyButton("⌫");
            backspaceButton.setOnClickListener(view -> deleteCharacter());
            controls.addView(backspaceButton, new LinearLayout.LayoutParams(0, -1, 1.15f));

            Button enterButton = keyButton("↵");
            enterButton.setOnClickListener(view -> pressEnter());
            controls.addView(enterButton, new LinearLayout.LayoutParams(0, -1, 1.15f));

            LinearLayout.LayoutParams controlParams = new LinearLayout.LayoutParams(-1, 0, 1);
            controlParams.setMargins(0, dp(ChatConvertInputMethodService.this, 2), 0, 0);
            keyArea.addView(controls, controlParams);
        }

        private Button keyButton(String text) {
            Button button = new Button(ChatConvertInputMethodService.this);
            button.setText(text);
            button.setTextSize(text.length() > 3 ? 10 : 15);
            button.setTextColor(TEXT);
            button.setAllCaps(false);
            button.setGravity(Gravity.CENTER);
            button.setPadding(0, 0, 0, 0);
            button.setMinHeight(0);
            button.setMinWidth(0);
            button.setBackground(rounded(KEY, dp(ChatConvertInputMethodService.this, 9)));
            return button;
        }
    }
}