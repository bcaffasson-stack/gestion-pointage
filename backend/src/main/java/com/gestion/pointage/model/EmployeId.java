package com.gestion.pointage.model;

import java.io.Serializable;

public class EmployeId implements Serializable {
    private String username;
    private String numEmp;

    public EmployeId() {}

    public EmployeId(String username, String numEmp) {
        this.username = username;
        this.numEmp = numEmp;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNumEmp() { return numEmp; }
    public void setNumEmp(String numEmp) { this.numEmp = numEmp; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EmployeId that = (EmployeId) o;
        if (username != null ? !username.equals(that.username) : that.username != null) return false;
        return numEmp != null ? numEmp.equals(that.numEmp) : that.numEmp == null;
    }

    @Override
    public int hashCode() {
        int result = username != null ? username.hashCode() : 0;
        result = 31 * result + (numEmp != null ? numEmp.hashCode() : 0);
        return result;
    }
}
