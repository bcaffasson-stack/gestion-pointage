package com.gestion.pointage.config;

import com.gestion.pointage.model.Utilisateur;
import com.gestion.pointage.repository.UtilisateurRepository;
import com.gestion.pointage.service.UtilisateurService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepo;
    private final UtilisateurService utilisateurService;

    public DataInitializer(UtilisateurRepository utilisateurRepo, UtilisateurService utilisateurService) {
        this.utilisateurRepo = utilisateurRepo;
        this.utilisateurService = utilisateurService;
    }

    @Override
    public void run(String... args) {
        // Chaque compte demarre vide : pas d'employes/pointages/conges par defaut.
        // L'admin retrouve ses donnees existantes en base (rattachees a son username).

        if (utilisateurRepo.count() == 0) {
            utilisateurRepo.save(new Utilisateur("admin", utilisateurService.hasher("admin"), "admin@pointage.com", "Administrateur"));
        }
    }
}
