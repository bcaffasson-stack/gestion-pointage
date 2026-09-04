package com.gestion.pointage.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "conge")
@IdClass(CongeId.class)
public class Conge {

    @Id
    @Column(name = "username", length = 50)
    private String username;

    @Id
    @Column(name = "numconge", length = 20)
    private String numConge;

    @Column(name = "numemp", nullable = false, length = 20)
    private String numEmp;

    @Column(name = "motif", nullable = false, length = 100)
    private String motif;

    @Column(name = "nbrjr", nullable = false)
    private int nbrjr;

    @Column(name = "datedemande", nullable = false)
    private LocalDate dateDemande;

    @Column(name = "dateretour", nullable = false)
    private LocalDate dateRetour;

    public Conge() {}

    public Conge(String username, String numConge, String numEmp, String motif, int nbrjr, LocalDate dateDemande, LocalDate dateRetour) {
        this.username = username;
        this.numConge = numConge;
        this.numEmp = numEmp;
        this.motif = motif;
        this.nbrjr = nbrjr;
        this.dateDemande = dateDemande;
        this.dateRetour = dateRetour;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNumConge() { return numConge; }
    public void setNumConge(String numConge) { this.numConge = numConge; }
    public String getNumEmp() { return numEmp; }
    public void setNumEmp(String numEmp) { this.numEmp = numEmp; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    public int getNbrjr() { return nbrjr; }
    public void setNbrjr(int nbrjr) { this.nbrjr = nbrjr; }
    public LocalDate getDateDemande() { return dateDemande; }
    public void setDateDemande(LocalDate dateDemande) { this.dateDemande = dateDemande; }
    public LocalDate getDateRetour() { return dateRetour; }
    public void setDateRetour(LocalDate dateRetour) { this.dateRetour = dateRetour; }
}
