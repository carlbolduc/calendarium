package io.codebards.calendarium.api;

public class Language {
    private long languageId;
    private String localeId;
    private String name;

	public long getLanguageId() {
		return languageId;
    }
    
	public void setLanguageId(long languageId) {
		this.languageId = languageId;
    }

	public String getLocaleId() {
		return localeId;
    }
    
	public void setLocaleId(String localeId) {
		this.localeId = localeId;
	}
	
    public String getName() {
		return name;
    }
    
	public void setName(String name) {
		this.name = name;
	}
}
