package org.gibdd.model;

import lombok.Data;

@Data
public class VinFullResponse {
    private GibddResponse gibdd;
    private RestrictResponse restrict;
    private GibddV2Response gibddv2;
    private WantedResponse wanted;
    private DtpResponse dtp;
    private FinesResponse fines;
    private EaistoResponse eaisto;

    private int ownersCount;
    private boolean hasRestriction;
    private boolean isWanted;
    private boolean hasAccidents;
    private boolean hasFines;
    private double finesAmount;
}
