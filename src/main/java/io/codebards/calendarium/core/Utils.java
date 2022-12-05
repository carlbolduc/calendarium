package io.codebards.calendarium.core;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.*;

public class Utils {

    private static final RandomString randomString = new RandomString();

    public static String createDigest() throws NoSuchAlgorithmException {
        String token = randomString.nextString();
        String digest = getHash(token);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(digest.getBytes());
    }

    public static String getHash(String stringToHash) throws NoSuchAlgorithmException {
        MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
        messageDigest.update(stringToHash.getBytes());
        String encryptedString = new String(messageDigest.digest());
        return Base64.getEncoder().encodeToString(encryptedString.getBytes());
    }

    public static String getToken() {
        return randomString.nextString();
    }

    static class RandomString {
        public String nextString() {
            for (int idx = 0; idx < buf.length; ++idx)
                buf[idx] = symbols[random.nextInt(symbols.length)];
            return new String(buf);
        }

        private static final String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        private static final String lower = upper.toLowerCase(Locale.ROOT);

        private static final String digits = "0123456789";

        private static final String alphanum = upper + lower + digits;

        private final Random random;

        private final char[] symbols;

        private final char[] buf;

        public RandomString(int length, Random random, String symbols) {
            if (length < 1) throw new IllegalArgumentException();
            if (symbols.length() < 2) throw new IllegalArgumentException();
            this.random = Objects.requireNonNull(random);
            this.symbols = symbols.toCharArray();
            this.buf = new char[length];
        }

        /**
         * Create an alphanumeric string generator.
         */
        public RandomString(int length, Random random) {
            this(length, random, alphanum);
        }

        /**
         * Create an alphanumeric strings from a secure generator.
         */
        public RandomString(int length) {
            this(length, new SecureRandom());
        }

        /**
         * Create session identifiers.
         */
        public RandomString() {
            this(32);
        }
    }

    public static List<String> getTaxRateDescriptions(String postalCode) {
        List<String> taxRateDescriptions = new ArrayList<>();
        switch (postalCode.toLowerCase().charAt(0)) {
            case 'a', 'b', 'c', 'e' ->
                // NL, NS, PE, NB
                    taxRateDescriptions.add("HST15");
            case 'g', 'h', 'j' -> {
                // QC
                taxRateDescriptions.add("GST");
                taxRateDescriptions.add("QST");
            }
            case 'k', 'l', 'm', 'n', 'p' ->
                // ON
                    taxRateDescriptions.add("HST13");
            case 'r', 's', 't', 'v', 'x', 'y' ->
                // MP, SK, AB, BC, NUNT, YT
                    taxRateDescriptions.add("HST15");
            default -> {
            }
        }
        return taxRateDescriptions;
    }

}
