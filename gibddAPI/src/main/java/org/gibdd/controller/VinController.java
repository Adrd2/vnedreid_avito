package org.gibdd.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.gibdd.model.*;
import org.gibdd.service.GibddService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/vin")
@RequiredArgsConstructor
@Slf4j
public class VinController {

    private final GibddService gibddService;

    @GetMapping("/{vin}")
    public ResponseEntity<VinFullResponse> getMockResponse(@PathVariable int code) {
        VinFullResponse response = switch (code) {
            case 1 -> createMockResponse(true, true, true, true, true, 2);
            case 2 -> createMockResponse(false, false, false, false, false, 1);
            case 3 -> createMockResponse(true, false, true, false, true, 3);
            case 4 -> createMockResponse(false, true, false, true, false, 4);
            case 5 -> createMockResponse(true, true, false, false, false, 5);
            default -> throw new IllegalArgumentException("Mock code must be from 1 to 5");
        };

        return ResponseEntity.ok(response);
    }

    private VinFullResponse createMockResponse(boolean restriction, boolean wanted, boolean hasAccidents, boolean hasFines, boolean hasEaisto, int ownersCount) {
        try {
            VinFullResponse res = new VinFullResponse();

            // Основная информация
            GibddResponse gibdd = new GibddResponse();
            gibdd.setStatus(200);
            gibdd.setFound(true);
            gibdd.setUtilicazia(0);
            gibdd.setUtilicaziainfo("");

            // Автомобиль
            GibddResponse.Vehicle vehicle = new GibddResponse.Vehicle();
            vehicle.setVin("MOCKVINCODE123456");
            vehicle.setBodyNumber("MOCKBODY123456");
            vehicle.setEngineNumber("MOCKENG1234");
            vehicle.setModel("MockCar 2025");
            vehicle.setColor("ЧЕРНЫЙ");
            vehicle.setYear("2025");
            vehicle.setEngineVolume("2000.0");
            vehicle.setPowerHp("150.0");
            vehicle.setPowerKwt("110.3");
            vehicle.setCategory("B");
            vehicle.setType("21");
            vehicle.setTypeinfo("Легковой универсал");
            gibdd.setVehicle(vehicle);

            // Владельцы
            List<GibddResponse.OwnershipPeriod> periods = new java.util.ArrayList<>();
            for (int i = 0; i < ownersCount; i++) {
                GibddResponse.OwnershipPeriod p = new GibddResponse.OwnershipPeriod();
                p.setLastOperation("03");
                p.setLastOperationInfo("Изменение собственника");
                p.setSimplePersonType("Natural");
                p.setSimplePersonTypeInfo("Физическое лицо");
                p.setFrom("01.01.202" + i);
                p.setTo(i < ownersCount - 1 ? "01.01.202" + (i + 1) : null);
                p.setPeriod("1 год");
                periods.add(p);
            }
            gibdd.setOwnershipPeriod(periods);

            // ПТС
            GibddResponse.VehiclePassport passport = new GibddResponse.VehiclePassport();
            passport.setNumber("MOCKPTS1234");
            passport.setIssue("МОК ТАМОЖНЯ");
            gibdd.setVehiclePassport(passport);

            // Инфо запроса
            GibddResponse.Inquiry inquiry = new GibddResponse.Inquiry();
            inquiry.setPrice(0.8);
            inquiry.setBalance(9999.99);
            inquiry.setCredit("0.00");
            inquiry.setSpeed(1);
            inquiry.setAttempts(1);
            gibdd.setInquiry(inquiry);

            res.setGibdd(gibdd);
            res.setOwnersCount(ownersCount);

            // Restrict
            RestrictResponse restrict = new RestrictResponse();
            restrict.setStatus(200);
            restrict.setFound(restriction);
            if (restriction) {
                RestrictResponse.Restriction r = new RestrictResponse.Restriction();
                r.setOsn("Запрет");
                r.setOgrkod("001");
                r.setRegname("ГУ МВД");
                r.setOgrdate("01.05.2024");
                restrict.setRestrictions(List.of(r));
            } else {
                restrict.setRestrictions(Collections.emptyList());
            }
            res.setRestrict(restrict);
            res.setHasRestriction(restriction);

            // Wanted
            WantedResponse wantedResp = new WantedResponse();
            wantedResp.setStatus(200);
            wantedResp.setFound(wanted);
            if (wanted) {
                WantedResponse.WantedInfo w = new WantedResponse.WantedInfo();
                w.setDate("01.04.2023");
                w.setReason("Хищение");
                w.setRegname("ГУ МВД");
                wantedResp.setRecords(List.of(w));
            } else {
                wantedResp.setRecords(Collections.emptyList());
            }
            res.setWanted(wantedResp);
            res.setWanted(wantedResp);  // <- объект типа WantedResponse
            res.setWantedCar(wanted);    // <- булевый флаг


            // ДТП
            DtpResponse dtp = new DtpResponse();
            dtp.setStatus(200);
            dtp.setFound(hasAccidents);
            if (hasAccidents) {
                DtpResponse.DtpInfo a = new DtpResponse.DtpInfo();
                a.setDate("10.12.2022");
                a.setRegion("МОСКВА");
                a.setType("столкновение");
                a.setDamage("задняя часть");
                dtp.setAccidents(List.of(a));
            } else {
                dtp.setAccidents(Collections.emptyList());
            }
            res.setDtp(dtp);
            res.setHasAccidents(hasAccidents);

            // Fines
            FinesResponse fines = new FinesResponse();
            fines.setStatus(200);
            fines.setFound(hasFines);
            if (hasFines) {
                FinesResponse.Fine f = new FinesResponse.Fine();
                f.setArticle("12.9 ч.2");
                f.setDate("01.05.2024");
                f.setNumber("1888888888888");
                f.setAmount(1500.0);
                f.setStatus("неоплачен");
                fines.setFines(List.of(f));
            } else {
                fines.setFines(Collections.emptyList());
            }
            res.setFines(fines);
            res.setHasFines(hasFines);
            res.setFinesAmount(fines.getTotalAmount());

            // Eaisto
            EaistoResponse eaisto = new EaistoResponse();
            eaisto.setStatus(200);
            eaisto.setFound(hasEaisto);
            if (hasEaisto) {
                EaistoResponse.EaistoRecord e = new EaistoResponse.EaistoRecord();
                e.setDate("01.01.2024");
                e.setResult("пройден");
                e.setOdometer("123456");
                e.setStation("СТО МОК");
                eaisto.setRecords(List.of(e));
            } else {
                eaisto.setRecords(Collections.emptyList());
            }
            res.setEaisto(eaisto);

            return res;
        } catch (Exception e) {
            log.error("Ошибка при отправке моков", e);
            return null;
        }
    }
}
