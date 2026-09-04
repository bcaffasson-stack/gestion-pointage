package com.gestion.pointage.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "pointage")
@IdClass(PointageId.class)
public class Pointage {

    @Id
    @Column(name = "username", length = 50)
    private String username;

    @Id
    @Column(name = "datepointage", nullable = false)
    private LocalDate datePointage;

    @Id
    @Column(name = "numemp", nullable = false, length = 20)
    private String numEmp;

    @Column(name = "pointage", nullable = false, length = 3)
    private String pointage = "oui";

    public Pointage() {}

    public Pointage(String username, LocalDate datePointage, String numEmp, String pointage) {
        this.username = username;
        this.datePointage = datePointage;
        this.numEmp = numEmp;
        this.pointage = pointage;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public LocalDate getDatePointage() { return datePointage; }
    public void setDatePointage(LocalDate datePointage) { this.datePointage = datePointage; }
    public String getNumEmp() { return numEmp; }
    public void setNumEmp(String numEmp) { this.numEmp = numEmp; }
    public String getPointage() { return pointage; }
    public void setPointage(String pointage) { this.pointage = pointage; }
}
