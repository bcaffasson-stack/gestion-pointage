package com.gestion.pointage.model;

import java.io.Serializable;
import java.time.LocalDate;

public class PointageId implements Serializable {
    private String username;
    private LocalDate datePointage;
    private String numEmp;

    public PointageId() {}

    public PointageId(String username, LocalDate datePointage, String numEmp) {
        this.username = username;
        this.datePointage = datePointage;
        this.numEmp = numEmp;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public LocalDate getDatePointage() { return datePointage; }
    public void setDatePointage(LocalDate datePointage) { this.datePointage = datePointage; }
    public String getNumEmp() { return numEmp; }
    public void setNumEmp(String numEmp) { this.numEmp = numEmp; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PointageId that = (PointageId) o;
        if (username != null ? !username.equals(that.username) : that.username != null) return false;
        if (datePointage != null ? !datePointage.equals(that.datePointage) : that.datePointage != null) return false;
        return numEmp != null ? numEmp.equals(that.numEmp) : that.numEmp == null;
    }

    @Override
    public int hashCode() {
        int result = username != null ? username.hashCode() : 0;
        result = 31 * result + (datePointage != null ? datePointage.hashCode() : 0);
        result = 31 * result + (numEmp != null ? numEmp.hashCode() : 0);
        return result;
    }
}
