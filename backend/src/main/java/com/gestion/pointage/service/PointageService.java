package com.gestion.pointage.service;

import com.gestion.pointage.model.Pointage;
import com.gestion.pointage.repository.PointageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PointageService {

    private final PointageRepository repository;
    private final EmployeService employeService;

    public PointageService(PointageRepository repository, EmployeService employeService) {
        this.repository = repository;
        this.employeService = employeService;
    }

    private static final int PENALITE_ABSENCE = 10000;

    @Transactional
    public Pointage insert(String username, Pointage pointage) {
        pointage.setUsername(username);
        Pointage saved = repository.save(pointage);
        if ("non".equalsIgnoreCase(pointage.getPointage())) {
            employeService.deductSalary(username, pointage.getNumEmp(), PENALITE_ABSENCE);
        }
        return saved;
    }

    @Transactional
    public Pointage update(String username, Pointage pointage, String ancienEtat) {
        pointage.setUsername(username);
        Pointage saved = repository.save(pointage);
        if ("non".equalsIgnoreCase(pointage.getPointage()) && !"non".equalsIgnoreCase(ancienEtat)) {
            employeService.deductSalary(username, pointage.getNumEmp(), PENALITE_ABSENCE);
        }
        return saved;
    }

    @Transactional
    public void delete(String username, LocalDate date, String numEmp) {
        repository.deleteByUsernameAndDatePointageAndNumEmp(username, date, numEmp);
    }

    public List<Pointage> findAll(String username) {
        return repository.findAllByUsername(username);
    }

    public Optional<Pointage> findByDateAndEmp(String username, LocalDate date, String numEmp) {
        return repository.findByUsernameAndDatePointageAndNumEmp(username, date, numEmp);
    }

    public List<Pointage> listAbsents(String username, LocalDate date) {
        return repository.findAbsentsByDate(username, date);
    }

    public long countAbsences(String username, String numEmp, int annee, int mois) {
        return repository.countAbsences(username, numEmp, annee, mois);
    }

    public List<Pointage> findRecent(String username) {
        return repository.findRecentPointages(username);
    }

    public Optional<LocalDate> derniereDatePointage(String username, String numEmp) {
        return repository.findDerniereDatePointage(username, numEmp);
    }

    public List<Object[]> countPresenceByDateRange(String username, LocalDate start, LocalDate end) {
        return repository.countPresenceByDateRange(username, start, end);
    }
}
