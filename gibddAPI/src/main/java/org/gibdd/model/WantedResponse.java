package org.gibdd.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class WantedResponse {

    private int status;
    private boolean found;
    private List<WantedInfo> records;

    public boolean isWanted() {
        return records != null && !records.isEmpty();
    }

    @Data
    public static class WantedInfo {
        private String regname;
        private String reason;
        private String date;
    }
}
