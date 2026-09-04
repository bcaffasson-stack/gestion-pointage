package com.gestion.pointage.service;

import com.gestion.pointage.dto.SoldeConge;
import com.gestion.pointage.model.Conge;
import com.gestion.pointage.model.CongeId;
import com.gestion.pointage.model.Employe;
import com.gestion.pointage.repository.CongeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CongeService {

    private final CongeRepository repository;
    private final EmployeService employeService;

    public CongeService(CongeRepository repository, EmployeService employeService) {
        this.repository = repository;
        this.employeService = employeService;
    }

    private static final int CONGE_ANNUEL = 30;

    public Conge save(String username, Conge conge) {
        if (conge.getNumConge() == null || conge.getNumConge().isEmpty()) {
            throw new RuntimeException("Le numero de conge est requis");
        }
        if (conge.getNbrjr() <= 0) {
            throw new RuntimeException("Le nombre de jours doit etre superieur a 0");
        }
        if (conge.getDateRetour().isBefore(conge.getDateDemande())) {
            throw new RuntimeException("La date de retour doit etre apres la date de demande");
        }
        conge.setUsername(username);
        return repository.save(conge);
    }

    public void delete(String username, String numConge) {
        repository.deleteById(new CongeId(username, numConge));
    }

    public List<Conge> findAll(String username) {
        return repository.findAllByUsername(username);
    }

    public int totalCongePris(String username, String numEmp, int annee) {
        return repository.totalCongePris(username, numEmp, annee);
    }

    public int soldeConge(String username, String numEmp, int annee) {
        return CONGE_ANNUEL - totalCongePris(username, numEmp, annee);
    }

    public boolean aDepasseQuota(String username, String numEmp, int annee) {
        return soldeConge(username, numEmp, annee) < 0;
    }

    public List<SoldeConge> listerSoldes(String username, int annee) {
        List<Employe> employes = employeService.findAll(username);
        List<SoldeConge> soldes = new ArrayList<>();
        for (Employe emp : employes) {
            int pris = totalCongePris(username, emp.getNumEmp(), annee);
            SoldeConge sc = new SoldeConge();
            sc.setNumEmp(emp.getNumEmp());
            sc.setNomComplet(emp.getNom() + " " + emp.getPrenom());
            sc.setTotalPris(pris);
            sc.setSolde(CONGE_ANNUEL - pris);
            sc.setDepasse(pris > CONGE_ANNUEL);
            soldes.add(sc);
        }
        return soldes;
    }

    public List<Conge> findRecent(String username) {
        return repository.findRecentConges(username);
    }
}
