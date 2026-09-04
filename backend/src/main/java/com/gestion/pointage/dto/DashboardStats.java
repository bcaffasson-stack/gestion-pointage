package com.gestion.pointage.dto;

import java.util.ArrayList;
import java.util.List;

public class DashboardStats {
    private long totalEmployes;
    private long presentsAujourdhui;
    private long enConge;
    private long totalPointages;
    private List<RecentPointage> pointagesRecents = new ArrayList<>();
    private List<RecentConge> congesRecents = new ArrayList<>();
    private double tauxPresence;
    private List<DailyPresence> presenceSemaine = new ArrayList<>();

    public long getTotalEmployes() { return totalEmployes; }
    public void setTotalEmployes(long totalEmployes) { this.totalEmployes = totalEmployes; }
    public long getPresentsAujourdhui() { return presentsAujourdhui; }
    public void setPresentsAujourdhui(long presentsAujourdhui) { this.presentsAujourdhui = presentsAujourdhui; }
    public long getEnConge() { return enConge; }
    public void setEnConge(long enConge) { this.enConge = enConge; }
    public long getTotalPointages() { return totalPointages; }
    public void setTotalPointages(long totalPointages) { this.totalPointages = totalPointages; }
    public List<RecentPointage> getPointagesRecents() { return pointagesRecents; }
    public void setPointagesRecents(List<RecentPointage> pointagesRecents) { this.pointagesRecents = pointagesRecents; }
    public List<RecentConge> getCongesRecents() { return congesRecents; }
    public void setCongesRecents(List<RecentConge> congesRecents) { this.congesRecents = congesRecents; }
    public double getTauxPresence() { return tauxPresence; }
    public void setTauxPresence(double tauxPresence) { this.tauxPresence = tauxPresence; }
    public List<DailyPresence> getPresenceSemaine() { return presenceSemaine; }
    public void setPresenceSemaine(List<DailyPresence> presenceSemaine) { this.presenceSemaine = presenceSemaine; }

    public static class RecentPointage {
        private String employe;
        private String date;
        private String statut;

        public String getEmploye() { return employe; }
        public void setEmploye(String employe) { this.employe = employe; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getStatut() { return statut; }
        public void setStatut(String statut) { this.statut = statut; }
    }

    public static class RecentConge {
        private String employe;
        private String motif;
        private int nbrJours;
        private String statut;

        public String getEmploye() { return employe; }
        public void setEmploye(String employe) { this.employe = employe; }
        public String getMotif() { return motif; }
        public void setMotif(String motif) { this.motif = motif; }
        public int getNbrJours() { return nbrJours; }
        public void setNbrJours(int nbrJours) { this.nbrJours = nbrJours; }
        public String getStatut() { return statut; }
        public void setStatut(String statut) { this.statut = statut; }
    }

    public static class DailyPresence {
        private String jour;
        private int nombre;

        public String getJour() { return jour; }
        public void setJour(String jour) { this.jour = jour; }
        public int getNombre() { return nombre; }
        public void setNombre(int nombre) { this.nombre = nombre; }
    }
}
