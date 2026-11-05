import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const keyboardIcon = require('../../assets/images/icon-generated.png');

type SetupButtonProps = {
  label: string;
  detail: string;
  icon: keyof typeof Feather.glyphMap;
  primary?: boolean;
  onPress: () => void;
};

function SetupButton({ label, detail, icon, primary = false, onPress }: SetupButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const colors = useColors();

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 28,
      bounciness: 5,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        onPressIn={() => animateTo(0.975)}
        onPressOut={() => animateTo(1)}
        style={[
          styles.setupButton,
          primary
            ? { backgroundColor: colors.primary }
            : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
        ]}
      >
        <View
          style={[
            styles.buttonIcon,
            { backgroundColor: primary ? 'rgba(7, 24, 61, 0.12)' : colors.tealSoft },
          ]}
        >
          <Feather name={icon} size={19} color={primary ? colors.deep : colors.foreground} />
        </View>
        <View style={styles.buttonCopy}>
          <Text
            style={[
              styles.buttonLabel,
              { color: primary ? colors.deep : colors.foreground },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.buttonDetail,
              { color: primary ? 'rgba(7, 24, 61, 0.68)' : colors.mutedForeground },
            ]}
          >
            {detail}
          </Text>
        </View>
        <Feather
          name="arrow-up-right"
          size={19}
          color={primary ? colors.deep : colors.mutedForeground}
        />
      </Pressable>
    </Animated.View>
  );
}

function SectionHeading({
  eyebrow,
  title,
  colors,
}: {
  eyebrow: string;
  title: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={[styles.eyebrow, { color: colors.accent }]}>{eyebrow}</Text>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

export default function TabOneScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const openKeyboardSettings = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert(
        'Android settings',
        'On Android, open Settings, choose System, then Keyboard and input method. Enable and select ChatConvert Keyboard there.',
        [{ text: 'Got it' }],
      );
      return;
    }

    try {
      await Linking.sendIntent('android.settings.INPUT_METHOD_SETTINGS');
      setSettingsOpened(true);
    } catch {
      Alert.alert(
        'Open keyboard settings',
        'We could not open Settings automatically. Go to Settings, then System, then Keyboard and input method. Enable and select ChatConvert Keyboard.',
        [{ text: 'Got it' }],
      );
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <LinearGradient
          colors={[colors.deep, '#0c2c59']}
          start={{ x: 0.05, y: 0 }}
          end={{ x: 0.95, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTopline}>
            <View style={styles.brandLockup}>
              <Image source={keyboardIcon} style={styles.brandIcon} />
              <View>
                <Text style={[styles.brandName, { color: colors.warm }]}>ChatConvert</Text>
                <Text style={[styles.brandMeta, { color: colors.primary }]}>KEYBOARD</Text>
              </View>
            </View>
            <View style={styles.readyBadge}>
              <View style={[styles.readyDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.readyText, { color: colors.warm }]}>READY</Text>
            </View>
          </View>

          <View style={styles.heroCopy}>
            <Text style={[styles.heroKicker, { color: colors.accent }]}>YOUR WORDS, YOUR WAY</Text>
            <Text style={[styles.heroTitle, { color: colors.warm }]}>
              Type in English.
              {'\n'}
              Send it in <Text style={{ color: colors.primary }}>your language.</Text>
            </Text>
            <Text style={[styles.heroSubtitle, { color: '#b8c7d4' }]}>
              ChatConvert turns Roman-letter typing into natural Telugu or Hindi, right where you chat.
            </Text>
          </View>

          <View style={styles.heroFooter}>
            <View style={styles.heroStat}>
              <Feather name="zap" size={14} color={colors.primary} />
              <Text style={[styles.heroStatText, { color: '#d8e4e8' }]}>Works in your usual apps</Text>
            </View>
            <View style={styles.heroRule} />
            <View style={styles.heroStat}>
              <Feather name="shield" size={14} color={colors.accent} />
              <Text style={[styles.heroStatText, { color: '#d8e4e8' }]}>Private by design</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          <View style={[styles.setupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardIntro}>
              <View style={styles.stepBadge}>
                <Text style={[styles.stepBadgeText, { color: colors.deep }]}>01</Text>
              </View>
              <View style={styles.cardIntroCopy}>
                <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>TWO QUICK STEPS</Text>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>Set up your keyboard</Text>
              </View>
              <Text style={[styles.timeText, { color: colors.mutedForeground }]}>~ 1 min</Text>
            </View>

            <Text style={[styles.cardDescription, { color: colors.mutedForeground }]}>
              Android keeps keyboard choices in Settings. We will take you to the exact place, then you can come straight back here.
            </Text>

            <View style={styles.stepsLine}>
              <View style={[styles.lineDot, { backgroundColor: colors.primary }]} />
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <View style={[styles.lineDot, { backgroundColor: settingsOpened ? colors.primary : colors.border }]} />
            </View>

            <SetupButton
              label="Enable ChatConvert"
              detail={settingsOpened ? 'Settings opened — turn the switch on' : 'Allow it in Android keyboard settings'}
              icon={settingsOpened ? 'check' : 'toggle-right'}
              primary
              onPress={openKeyboardSettings}
            />
            <SetupButton
              label="Select ChatConvert"
              detail="Choose it as your current keyboard"
              icon="check-square"
              onPress={openKeyboardSettings}
            />

            {settingsOpened ? (
              <View style={[styles.returnNote, { backgroundColor: colors.tealSoft }]}>
                <Feather name="corner-down-left" size={16} color={colors.foreground} />
                <Text style={[styles.returnNoteText, { color: colors.foreground }]}>
                  When you are done, come back here and start chatting.
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.section}>
            <SectionHeading eyebrow="WHERE IT WORKS" title="Your everyday chats" colors={colors} />
            <View style={styles.appGrid}>
              {[
                { name: 'WhatsApp', icon: 'message-circle' as const },
                { name: 'Instagram', icon: 'camera' as const },
                { name: 'Telegram', icon: 'send' as const },
                { name: 'Messenger', icon: 'message-square' as const },
                { name: 'SMS', icon: 'smartphone' as const },
              ].map((app, index) => (
                <View
                  key={app.name}
                  style={[
                    styles.appItem,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    index === 4 ? styles.appItemLast : null,
                  ]}
                >
                  <View style={[styles.appIcon, { backgroundColor: index % 2 === 0 ? colors.tealSoft : '#ffe2d7' }]}>
                    <Feather name={app.icon} size={18} color={colors.deep} />
                  </View>
                  <Text style={[styles.appName, { color: colors.foreground }]}>{app.name}</Text>
                </View>
              ))}
            </View>
            <Text style={[styles.caption, { color: colors.mutedForeground }]}>
              Open any chat, type with English letters, and switch languages from the ChatConvert keyboard.
            </Text>
          </View>

          <View style={[styles.languageCard, { backgroundColor: colors.deep }]}>
            <View style={styles.languageTop}>
              <View>
                <Text style={[styles.cardEyebrow, { color: colors.primary }]}>SUPPORTED TODAY</Text>
                <Text style={[styles.languageTitle, { color: colors.warm }]}>Two languages. Zero fuss.</Text>
              </View>
              <Feather name="type" size={24} color={colors.accent} />
            </View>
            <View style={styles.languageRows}>
              <View style={[styles.languageRow, { borderBottomColor: 'rgba(255,247,232,0.14)' }]}>
                <Text style={[styles.languageName, { color: colors.warm }]}>Telugu</Text>
                <Text style={[styles.languageNative, { color: colors.primary }]}>తెలుగు</Text>
              </View>
              <View style={styles.languageRow}>
                <Text style={[styles.languageName, { color: colors.warm }]}>Hindi</Text>
                <Text style={[styles.languageNative, { color: colors.primary }]}>हिन्दी</Text>
              </View>
            </View>
            <View style={[styles.romanNote, { backgroundColor: 'rgba(17,211,204,0.13)' }]}>
              <Feather name="edit-3" size={15} color={colors.primary} />
              <Text style={[styles.romanText, { color: '#d4e8e5' }]}>
                Roman letters only — type “namaste” or “ela unnaru” and ChatConvert does the rest.
              </Text>
            </View>
          </View>

          <View style={[styles.privacyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.privacyIcon, { backgroundColor: '#ffe2d7' }]}>
              <Feather name="shield" size={20} color={colors.deep} />
            </View>
            <View style={styles.privacyCopy}>
              <Text style={[styles.privacyTitle, { color: colors.foreground }]}>Your words stay yours.</Text>
              <Text style={[styles.privacyBody, { color: colors.mutedForeground }]}>
                ChatConvert is made for typing, not collecting. We do not save your conversations or build a profile from what you write.
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: showHelp }}
            onPress={() => setShowHelp((current) => !current)}
            style={({ pressed }) => [
              styles.helpHeader,
              { borderBottomColor: showHelp ? colors.border : 'transparent', opacity: pressed ? 0.72 : 1 },
            ]}
          >
            <View style={styles.helpTitleWrap}>
              <View style={[styles.helpIcon, { backgroundColor: colors.tealSoft }]}>
                <Feather name="help-circle" size={17} color={colors.foreground} />
              </View>
              <View>
                <Text style={[styles.helpTitle, { color: colors.foreground }]}>Need a hand?</Text>
                <Text style={[styles.helpSubtitle, { color: colors.mutedForeground }]}>
                  What happens after setup
                </Text>
              </View>
            </View>
            <Feather name={showHelp ? 'chevron-up' : 'chevron-down'} size={19} color={colors.mutedForeground} />
          </Pressable>

          {showHelp ? (
            <View style={[styles.helpBody, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.helpRow}>
                <Text style={[styles.helpNumber, { color: colors.accent }]}>1</Text>
                <Text style={[styles.helpText, { color: colors.mutedForeground }]}>
                  Tap the ChatConvert key whenever you want to translate what you are typing.
                </Text>
              </View>
              <View style={styles.helpRow}>
                <Text style={[styles.helpNumber, { color: colors.accent }]}>2</Text>
                <Text style={[styles.helpText, { color: colors.mutedForeground }]}>
                  Pick Telugu or Hindi, then keep typing with familiar English letters.
                </Text>
              </View>
              <View style={styles.helpRow}>
                <Text style={[styles.helpNumber, { color: colors.accent }]}>3</Text>
                <Text style={[styles.helpText, { color: colors.mutedForeground }]}>
                  Tap the suggestion you want. The converted text is ready to send.
                </Text>
              </View>
            </View>
          ) : null}

          <Text style={[styles.footer, { color: colors.mutedForeground }]}>
            ChatConvert Keyboard · A small bridge between how you think and how you chat.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  hero: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroTopline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandIcon: { width: 42, height: 42, borderRadius: 13 },
  brandName: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  brandMeta: { fontSize: 9, fontWeight: '800', letterSpacing: 2.3, marginTop: 2 },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,247,232,0.22)',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 99,
  },
  readyDot: { width: 6, height: 6, borderRadius: 3 },
  readyText: { fontSize: 9, fontWeight: '800', letterSpacing: 1.3 },
  heroCopy: { paddingTop: 43, paddingBottom: 36 },
  heroKicker: { fontSize: 10, fontWeight: '800', letterSpacing: 2.1, marginBottom: 13 },
  heroTitle: { fontSize: 34, lineHeight: 38, fontWeight: '800', letterSpacing: -1.2 },
  heroSubtitle: { fontSize: 15, lineHeight: 22, marginTop: 16, maxWidth: 340 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroStat: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
  heroStatText: { fontSize: 11, fontWeight: '600' },
  heroRule: { width: 1, height: 17, backgroundColor: 'rgba(255,247,232,0.2)' },
  mainContent: { paddingHorizontal: 16, paddingTop: 18 },
  setupCard: { borderRadius: 24, borderWidth: 1, padding: 16, shadowColor: '#07183d', shadowOpacity: 0.07, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  cardIntro: { flexDirection: 'row', alignItems: 'center' },
  stepBadge: { width: 39, height: 39, borderRadius: 13, backgroundColor: '#ff735d', alignItems: 'center', justifyContent: 'center' },
  stepBadgeText: { fontSize: 13, fontWeight: '800' },
  cardIntroCopy: { marginLeft: 11, flex: 1 },
  cardEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  cardTitle: { fontSize: 19, fontWeight: '800', letterSpacing: -0.4, marginTop: 2 },
  timeText: { fontSize: 11, fontWeight: '600', alignSelf: 'flex-start', paddingTop: 2 },
  cardDescription: { fontSize: 13, lineHeight: 19, marginTop: 15 },
  stepsLine: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 4 },
  lineDot: { width: 8, height: 8, borderRadius: 4 },
  line: { height: 1, flex: 1, marginHorizontal: 7 },
  setupButton: { minHeight: 65, flexDirection: 'row', alignItems: 'center', borderRadius: 17, paddingHorizontal: 11, marginBottom: 9 },
  buttonIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  buttonCopy: { flex: 1, paddingHorizontal: 11 },
  buttonLabel: { fontSize: 15, fontWeight: '800' },
  buttonDetail: { fontSize: 11, marginTop: 3 },
  returnNote: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 11, borderRadius: 12, marginTop: 3 },
  returnNoteText: { fontSize: 11, fontWeight: '600', flex: 1, lineHeight: 16 },
  section: { paddingTop: 31 },
  sectionHeading: { marginBottom: 13 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.8, marginBottom: 5 },
  sectionTitle: { fontSize: 23, fontWeight: '800', letterSpacing: -0.6 },
  appGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  appItem: { width: '31.7%', minHeight: 84, borderRadius: 17, borderWidth: 1, padding: 11, justifyContent: 'space-between' },
  appItemLast: { width: '31.7%' },
  appIcon: { width: 29, height: 29, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 12, fontWeight: '700', marginTop: 9 },
  caption: { fontSize: 12, lineHeight: 18, marginTop: 11, paddingHorizontal: 2 },
  languageCard: { borderRadius: 24, padding: 18, marginTop: 32 },
  languageTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  languageTitle: { fontSize: 21, fontWeight: '800', letterSpacing: -0.5, marginTop: 5 },
  languageRows: { marginTop: 20 },
  languageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  languageName: { fontSize: 16, fontWeight: '700' },
  languageNative: { fontSize: 17, fontWeight: '600' },
  romanNote: { flexDirection: 'row', gap: 9, alignItems: 'center', padding: 11, borderRadius: 13, marginTop: 14 },
  romanText: { fontSize: 11, lineHeight: 16, flex: 1, fontWeight: '600' },
  privacyCard: { flexDirection: 'row', borderRadius: 21, borderWidth: 1, padding: 15, marginTop: 14 },
  privacyIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  privacyCopy: { flex: 1, paddingLeft: 12 },
  privacyTitle: { fontSize: 15, fontWeight: '800' },
  privacyBody: { fontSize: 12, lineHeight: 18, marginTop: 5 },
  helpHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, paddingVertical: 18 },
  helpTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  helpIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  helpTitle: { fontSize: 14, fontWeight: '800' },
  helpSubtitle: { fontSize: 11, marginTop: 2 },
  helpBody: { borderWidth: 1, borderRadius: 17, padding: 14, marginTop: 12, gap: 13 },
  helpRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  helpNumber: { fontSize: 14, fontWeight: '800', width: 16 },
  helpText: { fontSize: 12, lineHeight: 18, flex: 1 },
  footer: { textAlign: 'center', fontSize: 10, lineHeight: 15, paddingHorizontal: 30, paddingTop: 23 },
});
