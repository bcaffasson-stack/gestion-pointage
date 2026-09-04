package com.gestion.pointage.controller;

import com.gestion.pointage.model.Employe;
import com.gestion.pointage.security.SecurityUtils;
import com.gestion.pointage.service.EmployeService;
import com.gestion.pointage.service.PdfService;
import com.gestion.pointage.service.PointageService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.Map;

@RestController
@RequestMapping("/api/fiche-paie")
public class FichePaieController {

    private final PdfService pdfService;
    private final EmployeService employeService;
    private final PointageService pointageService;

    public FichePaieController(PdfService pdfService, EmployeService employeService, PointageService pointageService) {
        this.pdfService = pdfService;
        this.employeService = employeService;
        this.pointageService = pointageService;
    }

    @GetMapping("/generate")
    public ResponseEntity<?> generer(
            @RequestParam String emp,
            @RequestParam String mois,
            @RequestParam int annee) {
        try {
            String username = SecurityUtils.currentUsername();
            Employe employe = employeService.findById(username, emp);

            int moisNum = getMoisNum(mois);
            int nbAbsences = (int) pointageService.countAbsences(username, emp, annee, moisNum);

            File pdf = pdfService.genererFichePaie(employe, mois, annee, nbAbsences);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + pdf.getName())
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new FileSystemResource(pdf));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private int getMoisNum(String mois) {
        return switch (mois.toLowerCase()) {
            case "janvier" -> 1; case "fevrier" -> 2; case "mars" -> 3;
            case "avril" -> 4; case "mai" -> 5; case "juin" -> 6;
            case "juillet" -> 7; case "aout" -> 8; case "septembre" -> 9;
            case "octobre" -> 10; case "novembre" -> 11; case "decembre" -> 12;
            default -> 1;
        };
    }
}

