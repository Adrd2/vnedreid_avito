package org.gibdd.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RestrictResponse {

    private int status;
    private boolean found;
    private List<Restriction> restrictions;

    public boolean hasRestriction() {
        return restrictions != null && !restrictions.isEmpty();
    }

    @Data
    public static class Restriction {
        private String osn;
        private String ogrkod;
        private String regname;
        private String ogrdate;
    }
}
