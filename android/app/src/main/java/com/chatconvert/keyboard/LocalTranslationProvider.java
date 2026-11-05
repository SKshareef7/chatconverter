package com.chatconvert.keyboard;

import java.util.LinkedHashMap;
import java.util.Map;

final class LocalTranslationProvider implements TranslationProvider {
    private final Map<String, String> teluguWords = new LinkedHashMap<>();
    private final Map<String, String> hindiWords = new LinkedHashMap<>();
    private final Map<String, String[]> phraseTranslations = new LinkedHashMap<>();

    LocalTranslationProvider() {
        addWord("father", "nanna", "baba");
        addWord("mother", "amma", "maa");
        addWord("brother", "anna / thammudu", "bhai");
        addWord("sister", "akka / chelli", "behen");
        addWord("friend", "snehithudu / snehithuralu", "dost");
        addWord("home", "illu", "ghar");
        addWord("water", "neellu", "paani");
        addWord("hello", "namaskaram", "namaste");
        addWord("hi", "namaskaram", "namaste");
        addWord("thanks", "dhanyavadalu", "dhanyavaad");
        addWord("thank", "dhanyavadalu", "shukriya");
        addWord("please", "dayachesi", "kripya");
        addWord("love", "prema", "pyaar");
        addWord("food", "bhojanam", "khaana");
        addWord("eat", "tinu", "khaao");
        addWord("come", "raa", "aao");
        addWord("go", "vellu", "jaao");
        addWord("good", "manchidi", "achha");
        addWord("morning", "udayam", "subah");
        addWord("night", "raatri", "raat");
        addWord("today", "eeroju", "aaj");
        addWord("tomorrow", "repu", "kal");
        addWord("yesterday", "ninna", "kal");
        addWord("what", "emi", "kya");
        addWord("are", "unnavu", "ho");
        addWord("you", "nuvvu", "tum");
        addWord("doing", "chestunnav", "kar rahe ho");
        addWord("do", "cheyyi", "karo");
        addWord("where", "ekkada", "kahaan");
        addWord("when", "eppudu", "kab");
        addWord("why", "enduku", "kyun");
        addWord("how", "ela", "kaise");
        addWord("is", "undi", "hai");
        addWord("my", "naa", "mera");
        addWord("your", "nee", "tumhara");
        addWord("name", "peru", "naam");

        addPhrase(
            "what are you doing",
            "Em chestunnav?",
            "Tum kya kar rahe ho?"
        );
        addPhrase(
            "how are you",
            "Ela unnaru?",
            "Aap kaise hain?"
        );
        addPhrase(
            "where are you",
            "Nuvvu ekkada unnave?",
            "Tum kahaan ho?"
        );
        addPhrase(
            "i am fine",
            "Nenu baagunnanu",
            "Main theek hoon"
        );
        addPhrase(
            "good morning",
            "Subhodayam",
            "Suprabhat"
        );
        addPhrase(
            "good night",
            "Shubha raatri",
            "Shubh raatri"
        );
        addPhrase(
            "thank you",
            "Dhanyavadalu",
            "Dhanyavaad"
        );
    }

    private void addWord(String english, String telugu, String hindi) {
        teluguWords.put(english, telugu);
        hindiWords.put(english, hindi);
    }

    private void addPhrase(String english, String telugu, String hindi) {
        phraseTranslations.put(english, new String[]{telugu, hindi});
    }

    @Override
    public Map<String, String> translate(String source) {
        String normalized = ConversionEngine.normalize(source);
        Map<String, String> result = new LinkedHashMap<>();
        String[] phrase = phraseTranslations.get(normalized);
        if (phrase != null) {
            result.put("Telugu", phrase[0]);
            result.put("Hindi", phrase[1]);
            return result;
        }

        result.put("Telugu", translateTokens(source, teluguWords));
        result.put("Hindi", translateTokens(source, hindiWords));
        return result;
    }

    private String translateTokens(String source, Map<String, String> dictionary) {
        StringBuilder output = new StringBuilder();
        String[] tokens = source.trim().split("(?<=[^A-Za-z])|(?=[^A-Za-z])");
        for (String token : tokens) {
            if (token.matches("[A-Za-z]+")) {
                String translated = dictionary.get(token.toLowerCase());
                output.append(translated == null ? token : matchCase(token, translated));
            } else {
                output.append(token);
            }
        }
        return output.toString().trim();
    }

    private String matchCase(String source, String translated) {
        if (source.equals(source.toUpperCase())) {
            return translated.toUpperCase();
        }
        if (Character.isUpperCase(source.charAt(0))) {
            return Character.toUpperCase(translated.charAt(0)) + translated.substring(1);
        }
        return translated;
    }
}