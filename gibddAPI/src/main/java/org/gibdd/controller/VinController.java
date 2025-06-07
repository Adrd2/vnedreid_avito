package org.gibdd.controller;

import lombok.RequiredArgsConstructor;
import org.gibdd.model.VinFullResponse;
import org.gibdd.service.GibddService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vin")
@RequiredArgsConstructor
public class VinController {

    private final GibddService gibddService;

    @GetMapping("/{vin}")
    public ResponseEntity<VinFullResponse> getCarDetails(@PathVariable String vin) {
        VinFullResponse response = gibddService.fetchFullVinData(vin);
        return ResponseEntity.ok(response);
    }
}
