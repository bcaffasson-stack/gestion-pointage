package com.gestion.pointage.repository;

import com.gestion.pointage.model.Pointage;
import com.gestion.pointage.model.PointageId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PointageRepository extends JpaRepository<Pointage, PointageId> {

    Optional<Pointage> findByUsernameAndDatePointageAndNumEmp(String username, LocalDate date, String numEmp);

    List<Pointage> findAllByUsername(String username);

    void deleteByUsernameAndDatePointageAndNumEmp(String username, LocalDate date, String numEmp);

    @Query("SELECT p FROM Pointage p WHERE p.username = :username AND p.datePointage = :date AND LOWER(p.pointage) = 'non'")
    List<Pointage> findAbsentsByDate(@Param("username") String username, @Param("date") LocalDate date);

    @Query("SELECT p FROM Pointage p WHERE p.username = :username ORDER BY p.datePointage DESC")
    List<Pointage> findRecentPointages(@Param("username") String username);

    @Query(value = "SELECT COUNT(*) FROM pointage WHERE username = :username AND numemp = :numEmp AND EXTRACT(YEAR FROM datepointage) = :annee AND EXTRACT(MONTH FROM datepointage) = :mois AND pointage = 'non'", nativeQuery = true)
    long countAbsences(@Param("username") String username, @Param("numEmp") String numEmp, @Param("annee") int annee, @Param("mois") int mois);

    @Query(value = "SELECT MAX(p.datepointage) FROM pointage p WHERE p.username = :username AND p.numemp = :numEmp", nativeQuery = true)
    Optional<LocalDate> findDerniereDatePointage(@Param("username") String username, @Param("numEmp") String numEmp);

    @Query(value = "SELECT p.datepointage, COUNT(CASE WHEN p.pointage = 'oui' THEN 1 END) as presents FROM pointage p WHERE p.username = :username AND p.datepointage >= :startDate AND p.datepointage <= :endDate GROUP BY p.datepointage ORDER BY p.datepointage", nativeQuery = true)
    List<Object[]> countPresenceByDateRange(@Param("username") String username, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
