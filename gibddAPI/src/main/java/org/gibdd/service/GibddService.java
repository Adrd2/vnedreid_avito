package org.gibdd.service;

import lombok.RequiredArgsConstructor;
import org.gibdd.model.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
public class GibddService {

    @Value("${gibdd.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate;

    public VinFullResponse fetchFullVinData(String vin) {
        String token = System.getenv("GIBDD_TOKEN");

        VinFullResponse result = new VinFullResponse();

        // Основной блок
        GibddResponse gibdd = fetchData(vin, "vin", GibddResponse.class, token);
        result.setGibdd(gibdd);
        result.setOwnersCount(gibdd.getOwnershipPeriod() != null ? gibdd.getOwnershipPeriod().size() : 0);

        // Остальные запросы
        result.setRestrict(fetchData(vin, "restrict", RestrictResponse.class, token));
        result.setHasRestriction(result.getRestrict() != null && result.getRestrict().hasRestriction());

        result.setGibddv2(fetchData(vin, "gibddv2", GibddV2Response.class, token));

        result.setWanted(fetchData(vin, "wanted", WantedResponse.class, token));
        WantedResponse wanted = fetchData(vin, "wanted", WantedResponse.class, token);
        result.setWanted(wanted);
        result.setWantedCar(wanted != null && wanted.isWanted());


        result.setDtp(fetchData(vin, "dtp", DtpResponse.class, token));
        result.setHasAccidents(result.getDtp() != null && result.getDtp().hasAccidents());

        result.setFines(fetchData(vin, "fines", FinesResponse.class, token));
        if (result.getFines() != null) {
            result.setHasFines(result.getFines().getTotalAmount() > 0);
            result.setFinesAmount(result.getFines().getTotalAmount());
        }

        result.setEaisto(fetchData(vin, "eaisto", EaistoResponse.class, token));

        return result;
    }

    private <T> T fetchData(String vin, String type, Class<T> clazz, String token) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("type", type)
                .queryParam("val", vin)
                .queryParam("token", token)
                .toUriString();

        try {
            return restTemplate.getForObject(url, clazz);
        } catch (Exception e) {
            return null;
        }
    }
}
