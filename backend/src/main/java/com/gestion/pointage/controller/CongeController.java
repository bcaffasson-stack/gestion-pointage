package com.gestion.pointage.controller;

import com.gestion.pointage.dto.SoldeConge;
import com.gestion.pointage.model.Conge;
import com.gestion.pointage.security.SecurityUtils;
import com.gestion.pointage.service.CongeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conges")
public class CongeController {

    private final CongeService service;

    public CongeController(CongeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Conge> findAll() {
        return service.findAll(SecurityUtils.currentUsername());
    }

    @GetMapping("/solde")
    public List<SoldeConge> listerSoldes(@RequestParam(defaultValue = "2026") int annee) {
        return service.listerSoldes(SecurityUtils.currentUsername(), annee);
    }

    @GetMapping("/solde/{numEmp}")
    public Map<String, Object> solde(@PathVariable String numEmp,
                                     @RequestParam(defaultValue = "2026") int annee) {
        String username = SecurityUtils.currentUsername();
        int solde = service.soldeConge(username, numEmp, annee);
        int pris = service.totalCongePris(username, numEmp, annee);
        return Map.of("numEmp", numEmp, "totalPris", pris, "solde", solde, "depasse", solde < 0);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Conge conge) {
        try {
            return ResponseEntity.ok(service.save(SecurityUtils.currentUsername(), conge));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Conge conge) {
        try {
            conge.setNumConge(id);
            return ResponseEntity.ok(service.save(SecurityUtils.currentUsername(), conge));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        service.delete(SecurityUtils.currentUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Conge supprime"));
    }
}

