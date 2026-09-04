package com.gestion.pointage.service;

import com.gestion.pointage.model.Employe;
import com.gestion.pointage.model.EmployeId;
import com.gestion.pointage.repository.EmployeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeService {

    private final EmployeRepository repository;

    public EmployeService(EmployeRepository repository) {
        this.repository = repository;
    }

    public Employe save(String username, Employe employe) {
        if (employe.getNumEmp() == null || employe.getNumEmp().isEmpty()) {
            throw new RuntimeException("Le numero d'employe est requis");
        }
        validerTexte(employe.getNom(), "Le nom");
        validerTexte(employe.getPrenom(), "Le prenom");
        employe.setUsername(username);
        return repository.save(employe);
    }

    // Meme regle que la version desktop (MainController.limiterAlphabetique):
    // lettres unicode (accents inclus), espaces, tirets et apostrophes uniquement
    private void validerTexte(String valeur, String champ) {
        if (valeur == null || !valeur.matches("[\\p{L} \\-']*")) {
            throw new RuntimeException(champ + " : lettres et accents uniquement !");
        }
    }

    public void delete(String username, String numEmp) {
        repository.deleteById(new EmployeId(username, numEmp));
    }

    public Employe findById(String username, String numEmp) {
        return repository.findById(new EmployeId(username, numEmp))
                .orElseThrow(() -> new RuntimeException("Employe non trouve"));
    }

    public List<Employe> findAll(String username) {
        return repository.findAllByUsername(username);
    }

    public List<Employe> search(String username, String mot) {
        return repository.search(username, mot);
    }

    public boolean existsById(String username, String numEmp) {
        return repository.existsById(new EmployeId(username, numEmp));
    }

    public void deductSalary(String username, String numEmp, int montant) {
        Employe emp = findById(username, numEmp);
        emp.setSalaire(emp.getSalaire() - montant);
        repository.save(emp);
    }
}
