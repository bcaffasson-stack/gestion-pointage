package com.gestion.pointage.model;

import jakarta.persistence.*;

@Entity
@Table(name = "employe")
@IdClass(EmployeId.class)
public class Employe {

    @Id
    @Column(name = "username", length = 50)
    private String username;

    @Id
    @Column(name = "numemp", length = 20)
    private String numEmp;

    @Column(name = "nom", nullable = false, length = 50)
    private String nom;

    @Column(name = "prenom", nullable = false, length = 50)
    private String prenom;

    @Column(name = "poste", nullable = false, length = 50)
    private String poste;

    @Column(name = "salaire", nullable = false)
    private int salaire;

    public Employe() {}

    public Employe(String username, String numEmp, String nom, String prenom, String poste, int salaire) {
        this.username = username;
        this.numEmp = numEmp;
        this.nom = nom;
        this.prenom = prenom;
        this.poste = poste;
        this.salaire = salaire;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNumEmp() { return numEmp; }
    public void setNumEmp(String numEmp) { this.numEmp = numEmp; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getPoste() { return poste; }
    public void setPoste(String poste) { this.poste = poste; }
    public int getSalaire() { return salaire; }
    public void setSalaire(int salaire) { this.salaire = salaire; }
}
