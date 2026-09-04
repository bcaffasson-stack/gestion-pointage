package com.gestion.pointage.controller;

import com.gestion.pointage.model.Employe;
import com.gestion.pointage.security.SecurityUtils;
import com.gestion.pointage.service.EmployeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employes")
public class EmployeController {

    private final EmployeService service;

    public EmployeController(EmployeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Employe> findAll() {
        return service.findAll(SecurityUtils.currentUsername());
    }

    @GetMapping("/{id}")
    public Employe findById(@PathVariable String id) {
        return service.findById(SecurityUtils.currentUsername(), id);
    }

    @GetMapping("/search")
    public List<Employe> search(@RequestParam String q) {
        return service.search(SecurityUtils.currentUsername(), q);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Employe employe) {
        try {
            return ResponseEntity.ok(service.save(SecurityUtils.currentUsername(), employe));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Employe employe) {
        try {
            employe.setNumEmp(id);
            return ResponseEntity.ok(service.save(SecurityUtils.currentUsername(), employe));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        service.delete(SecurityUtils.currentUsername(), id);
        return ResponseEntity.ok(Map.of("message", "Employe supprime"));
    }
}

