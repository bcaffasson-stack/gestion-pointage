package com.gestion.pointage.dto;

public class SoldeConge {
    private String numEmp;
    private String nomComplet;
    private int totalPris;
    private int solde;
    private boolean depasse;

    public String getNumEmp() { return numEmp; }
    public void setNumEmp(String numEmp) { this.numEmp = numEmp; }
    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }
    public int getTotalPris() { return totalPris; }
    public void setTotalPris(int totalPris) { this.totalPris = totalPris; }
    public int getSolde() { return solde; }
    public void setSolde(int solde) { this.solde = solde; }
    public boolean isDepasse() { return depasse; }
    public void setDepasse(boolean depasse) { this.depasse = depasse; }
}
