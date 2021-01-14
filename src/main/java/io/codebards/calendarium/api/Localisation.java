package io.codebards.calendarium.api;

public class Localisation {
    private String enCa;
    private String userLanguage;

    public String getEnCa() {
        return enCa;
    }

    public String getUserLanguage() {
        return userLanguage;
    }

    public void setUserLanguage(String userLanguage) {
        this.userLanguage = userLanguage;
    }

    public void setEnCa(String enCa) {
        this.enCa = enCa;
    }
}
