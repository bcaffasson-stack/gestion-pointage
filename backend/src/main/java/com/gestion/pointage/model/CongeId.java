package com.gestion.pointage.model;

import java.io.Serializable;

public class CongeId implements Serializable {
    private String username;
    private String numConge;

    public CongeId() {}

    public CongeId(String username, String numConge) {
        this.username = username;
        this.numConge = numConge;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNumConge() { return numConge; }
    public void setNumConge(String numConge) { this.numConge = numConge; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CongeId that = (CongeId) o;
        if (username != null ? !username.equals(that.username) : that.username != null) return false;
        return numConge != null ? numConge.equals(that.numConge) : that.numConge == null;
    }

    @Override
    public int hashCode() {
        int result = username != null ? username.hashCode() : 0;
        result = 31 * result + (numConge != null ? numConge.hashCode() : 0);
        return result;
    }
}
