package com.gestion.pointage.config;

import com.gestion.pointage.model.Utilisateur;
import com.gestion.pointage.repository.UtilisateurRepository;
import com.gestion.pointage.service.UtilisateurService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

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

        if (utilisateurRepo.count() == 0) {
            // Premier lancement : creation de l'admin avec mot de passe par defaut
            // -> mot de passe a changer obligatoirement a la premiere connexion
            Utilisateur admin = new Utilisateur("admin", utilisateurService.hasher("admin"), "admin@pointage.com", "Administrateur");
            admin.setMdpAChanger(true);
            utilisateurRepo.save(admin);
        } else {
            // Si l'admin existe encore avec le mot de passe par defaut, forcer le changement
            Optional<Utilisateur> admin = utilisateurRepo.findByUsernameIgnoreCase("admin");
            admin.filter(u -> u.getPassword().equalsIgnoreCase(utilisateurService.hasher("admin")))
                    .ifPresent(u -> {
                        u.setMdpAChanger(true);
                        utilisateurRepo.save(u);
                    });
        }
    }
}