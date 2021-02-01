package io.codebards.calendarium.api;

public class Language {
    private long languageId;
    private long localeId;
    private String name;

	public long getLanguageId() {
		return languageId;
    }
    
	public void setLanguageId(long languageId) {
		this.languageId = languageId;
    }

	public long getLocaleId() {
		return localeId;
    }
    
	public void setLocaleId(long localeId) {
		this.localeId = localeId;
	}
	
    public String getName() {
		return name;
    }
    
	public void setName(String name) {
		this.name = name;
	}
}
