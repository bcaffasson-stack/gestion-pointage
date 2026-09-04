package com.gestion.pointage.controller;

import com.gestion.pointage.dto.ChangePasswordRequest;
import com.gestion.pointage.model.Utilisateur;
import com.gestion.pointage.security.SecurityUtils;
import com.gestion.pointage.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UtilisateurService service;

    public UserController(UtilisateurService service) {
        this.service = service;
    }

    // Chaque utilisateur n'accede qu'a son propre compte (multi-tenant)
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        String username = SecurityUtils.currentUsername();
        Utilisateur user = service.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<?> update(@RequestBody Utilisateur user) {
        try {
            String username = SecurityUtils.currentUsername();
            Utilisateur saved = service.modifier(username, user.getEmail(), user.getNomComplet());
            saved.setPassword(null);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            if (request.getNewPassword() == null || request.getNewPassword().length() < 4) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le mot de passe doit contenir au moins 4 caracteres"));
            }
            String username = SecurityUtils.currentUsername();
            service.changerMotDePasse(username, request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Mot de passe modifie"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
