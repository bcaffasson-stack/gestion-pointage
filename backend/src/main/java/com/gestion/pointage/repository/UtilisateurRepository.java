package com.gestion.pointage.repository;

import com.gestion.pointage.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, String> {

    Optional<Utilisateur> findByUsernameIgnoreCase(String username);

    boolean existsByUsernameIgnoreCase(String username);
}
