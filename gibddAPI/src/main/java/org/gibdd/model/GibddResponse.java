package org.gibdd.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GibddResponse {

    private int status;
    private boolean found;
    private int utilicazia;
    private String utilicaziainfo;
    private Vehicle vehicle;
    private VehiclePassport vehiclePassport;
    private List<OwnershipPeriod> ownershipPeriod;
    private Inquiry inquiry;

    @Data
    public static class Vehicle {
        private String vin;
        private String bodyNumber;
        private String engineNumber;
        private String model;
        private String color;
        private String year;
        private String engineVolume;

        @JsonProperty("powerHp")
        private String powerHp;

        @JsonProperty("powerKwt")
        private String powerKwt;

        private String category;
        private String type;
        private String typeinfo;
    }

    @Data
    public static class VehiclePassport {
        private String number;
        private String issue;
    }

    @Data
    public static class OwnershipPeriod {
        private String lastOperation;
        private String lastOperationInfo;
        private String simplePersonType;
        private String simplePersonTypeInfo;
        private String from;
        private String to;
        private String period;
    }

    @Data
    public static class Inquiry {
        private double price;
        private double balance;
        private String credit;
        private int speed;
        private int attempts;
    }
}
