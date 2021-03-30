package io.codebards.calendarium.core;

import java.util.ArrayList;
import java.util.List;

public class TaxRates {
    public List<String> getTaxRateDescriptions(String postalCode) {
        List<String> taxRateDescriptions = new ArrayList<>();
        switch (postalCode.toLowerCase().charAt(0)) {
            case 'a': case 'b': case 'c': case 'e':
                // NL, NS, PE, NB
                taxRateDescriptions.add("HST15");
                break;
            case 'g': case 'h': case 'j':
                // QC
                taxRateDescriptions.add("GST");
                taxRateDescriptions.add("QST");
                break;
            case 'k': case 'l': case 'm': case 'n': case 'p':
                // ON
                taxRateDescriptions.add("HST13");
                break;
            case 'r': case 's': case 't': case 'v': case 'x': case 'y':
                // MP, SK, AB, BC, NUNT, YT
                taxRateDescriptions.add("GST");
                break;
            default:
                break;
        }
        return taxRateDescriptions;
    }
}
