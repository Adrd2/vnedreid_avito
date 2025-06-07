package org.gibdd.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class EaistoResponse {

    private int status;
    private boolean found;
    private List<EaistoRecord> records;

    @Data
    public static class EaistoRecord {
        private String date;
        private String result;
        private String odometer;
        private String station;
    }
}
