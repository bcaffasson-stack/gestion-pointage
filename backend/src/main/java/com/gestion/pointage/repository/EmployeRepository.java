package com.gestion.pointage.repository;

import com.gestion.pointage.model.Employe;
import com.gestion.pointage.model.EmployeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, EmployeId> {

    List<Employe> findAllByUsername(String username);

    @Query("SELECT e FROM Employe e WHERE e.username = :username AND (LOWER(e.nom) LIKE LOWER(CONCAT('%', :mot, '%')) OR LOWER(e.prenom) LIKE LOWER(CONCAT('%', :mot, '%')))")
    List<Employe> search(@Param("username") String username, @Param("mot") String mot);
}
