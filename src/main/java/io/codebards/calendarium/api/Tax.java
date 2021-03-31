package io.codebards.calendarium.api;

public class Tax {
    private String stripeTaxId;
    private String description;

    public String getStripeTaxId() {
        return stripeTaxId;
    }

    public void setStripeTaxId(String stripeTaxId) {
        this.stripeTaxId = stripeTaxId;
    }

    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
}
