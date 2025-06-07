package org.gibdd.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DtpResponse {

    private int status;
    private boolean found;
    private List<DtpInfo> accidents;

    public boolean hasAccidents() {
        return accidents != null && !accidents.isEmpty();
    }

    @Data
    public static class DtpInfo {
        private String date;
        private String region;
        private String type;
        private String damage;
    }
}
