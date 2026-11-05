package com.chatconvert.keyboard;

import java.util.Map;

/**
 * Extension point for a future remote provider.
 *
 * The keyboard ships with a local provider so common conversions never need a
 * network request. A remote implementation can be injected here later without
 * changing the InputMethodService or result UI. Keep API credentials on a
 * server; never put provider keys in the Android bundle.
 */
public interface TranslationProvider {
    Map<String, String> translate(String source);
}