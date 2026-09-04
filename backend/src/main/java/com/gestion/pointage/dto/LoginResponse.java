package com.gestion.pointage.dto;

public class LoginResponse {
    private String token;
    private String username;
    private String nomComplet;
    private String role;

    public LoginResponse() {}

    public LoginResponse(String token, String username, String nomComplet, String role) {
        this.token = token;
        this.username = username;
        this.nomComplet = nomComplet;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
