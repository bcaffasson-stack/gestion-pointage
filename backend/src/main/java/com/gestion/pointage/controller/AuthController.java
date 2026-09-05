package com.gestion.pointage.controller;

import com.gestion.pointage.dto.*;
import com.gestion.pointage.model.Utilisateur;
import com.gestion.pointage.security.JwtUtil;
import com.gestion.pointage.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtilisateurService service;
    private final JwtUtil jwtUtil;

    public AuthController(UtilisateurService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return service.verifierConnexion(request.getUsername(), request.getPassword())
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getUsername(), "Administrateur");
                    return ResponseEntity.ok((Object) new LoginResponse(
                            token, user.getUsername(), user.getNomComplet(), "Administrateur", user.isMdpAChanger()));
                })
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Nom d'utilisateur ou mot de passe incorrect")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (request.getPassword().length() < 4) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le mot de passe doit contenir au moins 4 caracteres"));
            }
            Utilisateur user = service.inscrire(
                    request.getUsername(), request.getEmail(),
                    request.getNomComplet(), request.getPassword());
            return ResponseEntity.ok(Map.of("message", "Compte cree avec succes"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean success = service.reinitialiserMotDePasse(
                request.getUsername(), request.getEmail(), request.getNewPassword());
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Mot de passe reinitialise"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Nom d'utilisateur ou email incorrect"));
    }
}

