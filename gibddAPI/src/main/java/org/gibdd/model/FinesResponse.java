package org.gibdd.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FinesResponse {

    private int status;
    private boolean found;
    private List<Fine> fines;

    public boolean hasFines() {
        return fines != null && !fines.isEmpty();
    }

    public double getTotalAmount() {
        if (fines == null) return 0;
        return fines.stream().mapToDouble(Fine::getAmount).sum();
    }

    @Data
    public static class Fine {
        private String article;
        private String date;
        private String number;
        private double amount;
        private String status;
    }
}
