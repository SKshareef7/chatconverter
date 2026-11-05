# ChatConvert Keyboard Android build

ChatConvert is an Expo companion app plus a native Android `InputMethodService`.
The native keyboard is added during Expo prebuild by
`plugins/withChatConvertKeyboard.js`.

## Build the Android project

From this directory:

```bash
pnpm install
pnpm exec expo prebuild --platform android
cd android
./gradlew assembleDebug
```

The generated Android project contains:

- `com.chatconvert.keyboard.ChatConvertInputMethodService`
- the `android.view.InputMethod` service declaration
- Romanized Telugu and Hindi local conversion data
- optional server-side translation fallback, enabled only when
  `CHATCONVERT_TRANSLATION_API_URL` is set during prebuild
- QWERTY, shift, backspace, space, enter, symbols, Convert, Settings, and result buttons

The keyboard does not open or control chat apps. Android sends it the active
`InputConnection`, which is the supported way for a third-party keyboard to
write into the focused field.

## Manual smoke test

1. Install the debug APK on an Android device.
2. Launch ChatConvert Keyboard and tap **Enable ChatConvert**.
3. Enable it in Android keyboard settings and select it as the current keyboard.
4. Open WhatsApp, Instagram, Telegram, Messenger, or SMS.
5. Type `Father`, tap **Convert**, then tap `Telugu: nanna`.
6. Confirm `nanna` replaces the typed English text in the active field.
7. Repeat with `What are you doing?` and confirm the sentence results appear.

The local provider never uploads or stores typed text. The optional remote
provider is disabled by default. If enabled, it sends only the requested text
to the configured server endpoint and expects:

```json
{ "telugu": "nanna", "hindi": "baba" }
```

The server owns any translation API credential; no API key is placed in the
APK.