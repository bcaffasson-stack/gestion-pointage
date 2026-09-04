package com.gestion.pointage.repository;

import com.gestion.pointage.model.Conge;
import com.gestion.pointage.model.CongeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CongeRepository extends JpaRepository<Conge, CongeId> {

    @Query("SELECT COALESCE(SUM(c.nbrjr), 0) FROM Conge c WHERE c.username = :username AND c.numEmp = :numEmp AND YEAR(c.dateDemande) = :annee")
    int totalCongePris(@Param("username") String username, @Param("numEmp") String numEmp, @Param("annee") int annee);

    List<Conge> findAllByUsername(String username);

    @Query("SELECT c FROM Conge c WHERE c.username = :username ORDER BY c.dateDemande DESC")
    List<Conge> findRecentConges(@Param("username") String username);
}
