package com.gestion.pointage.service;

import com.gestion.pointage.model.Utilisateur;
import com.gestion.pointage.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    private final UtilisateurRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<Utilisateur> verifierConnexion(String username, String password) {
        Optional<Utilisateur> user = repository.findByUsernameIgnoreCase(username);
        if (user.isPresent()) {
            String hashed = hasher(password);
            if (user.get().getPassword().equalsIgnoreCase(hashed)) {
                return user;
            }
        }
        return Optional.empty();
    }

    public boolean existe(String username) {
        return repository.existsByUsernameIgnoreCase(username);
    }

    public Utilisateur inscrire(String username, String email, String nomComplet, String password) {
        if (existe(username)) {
            throw new RuntimeException("Nom d'utilisateur deja utilise");
        }
        Utilisateur user = new Utilisateur(username, hasher(password), email, nomComplet);
        user.setMdpAChanger(false);
        return repository.save(user);
    }

    public void forceChangementMdp(String username) {
        repository.findByUsernameIgnoreCase(username).ifPresent(u -> {
            u.setMdpAChanger(true);
            repository.save(u);
        });
    }

    public Utilisateur modifier(String username, String email, String nomComplet) {
        Utilisateur user = repository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));
        user.setEmail(email);
        user.setNomComplet(nomComplet);
        return repository.save(user);
    }

    public void supprimer(String username) {
        repository.deleteById(username);
    }

    public void changerMotDePasse(String username, String newPassword) {
        Utilisateur user = repository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));
        user.setPassword(hasher(newPassword));
        user.setMdpAChanger(false);
        repository.save(user);
    }

    public boolean reinitialiserMotDePasse(String username, String email, String newPassword) {
        Optional<Utilisateur> user = repository.findByUsernameIgnoreCase(username);
        if (user.isPresent() && user.get().getEmail().equalsIgnoreCase(email)) {
            user.get().setPassword(hasher(newPassword));
            repository.save(user.get());
            return true;
        }
        return false;
    }

    public List<Utilisateur> lister() {
        return repository.findAll();
    }

    public Optional<Utilisateur> findByUsername(String username) {
        return repository.findByUsernameIgnoreCase(username);
    }

    public String hasher(String mdp) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(mdp.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}

