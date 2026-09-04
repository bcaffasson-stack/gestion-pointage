package com.gestion.pointage.controller;

import com.gestion.pointage.model.Pointage;
import com.gestion.pointage.security.SecurityUtils;
import com.gestion.pointage.service.PointageService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pointages")
public class PointageController {

    private final PointageService service;

    public PointageController(PointageService service) {
        this.service = service;
    }

    @GetMapping
    public List<Pointage> findAll() {
        return service.findAll(SecurityUtils.currentUsername());
    }

    @GetMapping("/absents")
    public List<Pointage> listAbsents(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.listAbsents(SecurityUtils.currentUsername(), date);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Pointage pointage) {
        try {
            return ResponseEntity.ok(service.insert(SecurityUtils.currentUsername(), pointage));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody Map<String, Object> body) {
        try {
            Pointage pointage = new Pointage();
            pointage.setDatePointage(LocalDate.parse((String) body.get("datePointage")));
            pointage.setNumEmp((String) body.get("numEmp"));
            pointage.setPointage((String) body.get("pointage"));
            String ancienEtat = (String) body.get("ancienEtat");
            return ResponseEntity.ok(service.update(SecurityUtils.currentUsername(), pointage, ancienEtat));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{date}/{numEmp}")
    public ResponseEntity<?> delete(@PathVariable String date, @PathVariable String numEmp) {
        service.delete(SecurityUtils.currentUsername(), LocalDate.parse(date), numEmp);
        return ResponseEntity.ok(Map.of("message", "Pointage supprime"));
    }
}

