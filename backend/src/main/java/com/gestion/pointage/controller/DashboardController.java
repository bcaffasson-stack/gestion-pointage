package com.gestion.pointage.controller;

import com.gestion.pointage.dto.DashboardStats;
import com.gestion.pointage.model.Conge;
import com.gestion.pointage.model.Pointage;
import com.gestion.pointage.security.SecurityUtils;
import com.gestion.pointage.service.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final EmployeService employeService;
    private final PointageService pointageService;
    private final CongeService congeService;

    public DashboardController(EmployeService employeService, PointageService pointageService, CongeService congeService) {
        this.employeService = employeService;
        this.pointageService = pointageService;
        this.congeService = congeService;
    }

    @GetMapping("/stats")
    public DashboardStats stats() {
        DashboardStats stats = new DashboardStats();
        LocalDate today = LocalDate.now();
        String username = SecurityUtils.currentUsername();

        stats.setTotalEmployes(employeService.findAll(username).size());

        List<Pointage> recentPointages = pointageService.findRecent(username);
        Optional<LocalDate> derniereDate = recentPointages.isEmpty()
                ? Optional.empty()
                : Optional.of(recentPointages.get(0).getDatePointage());

        long presents = 0;
        if (derniereDate.isPresent() && !derniereDate.get().isBefore(today)) {
            presents = recentPointages.stream()
                    .filter(p -> p.getDatePointage().equals(derniereDate.get()) && "oui".equalsIgnoreCase(p.getPointage()))
                    .count();
        }
        stats.setPresentsAujourdhui(presents);
        stats.setTotalPointages(recentPointages.size());

        int annee = today.getYear();
        List<Conge> allConges = congeService.findAll(username);
        long enConge = allConges.stream()
                .filter(c -> !today.isBefore(c.getDateDemande()) && !today.isAfter(c.getDateRetour()))
                .count();
        stats.setEnConge(enConge);

        // Taux presence
        if (stats.getTotalEmployes() > 0) {
            stats.setTauxPresence((double) presents / stats.getTotalEmployes() * 100);
        } else {
            stats.setTauxPresence(0);
        }

        // Recent pointages
        List<DashboardStats.RecentPointage> rpList = recentPointages.stream()
                .limit(5)
                .map(p -> {
                    DashboardStats.RecentPointage rp = new DashboardStats.RecentPointage();
                    rp.setEmploye(p.getNumEmp());
                    rp.setDate(p.getDatePointage().toString());
                    rp.setStatut("oui".equalsIgnoreCase(p.getPointage()) ? "Present" : "Absent");
                    return rp;
                }).collect(Collectors.toList());
        stats.setPointagesRecents(rpList);

        // Recent conges
        List<DashboardStats.RecentConge> rcList = congeService.findRecent(username).stream()
                .limit(4)
                .map(c -> {
                    DashboardStats.RecentConge rc = new DashboardStats.RecentConge();
                    rc.setEmploye(c.getNumEmp());
                    rc.setMotif(c.getMotif());
                    rc.setNbrJours(c.getNbrjr());
                    String statut = today.isAfter(c.getDateRetour()) ? "Termine" :
                            today.isBefore(c.getDateDemande()) ? "En attente" : "En cours";
                    rc.setStatut(statut);
                    return rc;
                }).collect(Collectors.toList());
        stats.setCongesRecents(rcList);

        // Weekly presence
        List<DashboardStats.DailyPresence> weekly = new ArrayList<>();
        LocalDate weekStart = today.with(DayOfWeek.MONDAY);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("EEE", Locale.FRENCH);
        for (int i = 0; i < 7; i++) {
            LocalDate day = weekStart.plusDays(i);
            DashboardStats.DailyPresence dp = new DashboardStats.DailyPresence();
            dp.setJour(day.format(fmt));
            long count = recentPointages.stream()
                    .filter(p -> p.getDatePointage().equals(day) && "oui".equalsIgnoreCase(p.getPointage()))
                    .count();
            dp.setNombre((int) count);
            weekly.add(dp);
        }
        stats.setPresenceSemaine(weekly);

        return stats;
    }
}

