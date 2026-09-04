package com.gestion.pointage.service;

import com.gestion.pointage.model.Employe;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    @Value("${pdf.output.dir:./pdf-output}")
    private String outputDir;

    public File genererFichePaie(Employe employe, String mois, int annee, int nbAbsences) throws IOException {
        File dir = new File(outputDir);
        if (!dir.exists()) dir.mkdirs();

        String fileName = String.format("fiche_paie_%s_%s_%d.pdf",
                employe.getNumEmp(), mois.toLowerCase(), annee);
        File file = new File(dir, fileName);

        PDDocument doc = new PDDocument();
        PDPage page = new PDPage();
        doc.addPage(page);

        PDPageContentStream cs = new PDPageContentStream(doc, page);
        PDType1Font helvetica = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
        PDType1Font helveticaBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
        float y = 750;

        cs.beginText();
        cs.setFont(helveticaBold, 20);
        cs.newLineAtOffset(200, y);
        cs.showText(sanitize("FICHE DE PAIE"));
        cs.endText();

        y -= 15;
        drawLine(cs, 50, y, 545, y);

        y -= 25;
        cs.beginText();
        cs.setFont(helvetica, 11);
        cs.newLineAtOffset(50, y);
        cs.showText(sanitize("Date: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
        cs.endText();

        y -= 30;
        cs.beginText();
        cs.setFont(helveticaBold, 13);
        cs.newLineAtOffset(50, y);
        cs.showText(sanitize("Nom: " + employe.getNom().toUpperCase()));
        cs.endText();

        y -= 25;
        cs.beginText();
        cs.setFont(helvetica, 12);
        cs.newLineAtOffset(50, y);
        cs.showText(sanitize("Prenoms: " + employe.getPrenom()));
        cs.endText();

        y -= 25;
        cs.beginText();
        cs.setFont(helvetica, 12);
        cs.newLineAtOffset(50, y);
        cs.showText(sanitize("Poste: " + employe.getPoste()));
        cs.endText();

        y -= 25;
        cs.beginText();
        cs.setFont(helvetica, 12);
        cs.newLineAtOffset(50, y);
        cs.showText(sanitize("Mois: " + mois + " " + annee));
        cs.endText();

        y -= 25;
        cs.beginText();
        cs.setFont(helvetica, 12);
        cs.newLineAtOffset(50, y);
        cs.showText(sanitize("Nombre d'absences: " + nbAbsences));
        cs.endText();

        y -= 15;
        drawLine(cs, 50, y, 545, y);

        y -= 30;
        cs.beginText();
        cs.setFont(helveticaBold, 14);
        cs.newLineAtOffset(50, y);
        cs.showText(sanitize("Montant brut: " + formatMontant(employe.getSalaire()) + " Ar"));
        cs.endText();

        int deductions = nbAbsences * (employe.getSalaire() / 30);
        int salaireNet = employe.getSalaire() - deductions;

        y -= 25;
        cs.beginText();
        cs.setFont(helvetica, 12);
        cs.newLineAtOffset(50, y);
        cs.showText(sanitize("Deductions (absences): -" + formatMontant(deductions) + " Ar"));
        cs.endText();

        y -= 10;
        drawLine(cs, 50, y, 545, y);

        y -= 25;
        cs.beginText();
        cs.setFont(helveticaBold, 14);
        cs.newLineAtOffset(50, y);
        cs.showText(sanitize("Salaire net: " + formatMontant(salaireNet) + " Ar"));
        cs.endText();

        y -= 25;
        cs.beginText();
        cs.setFont(helvetica, 10);
        cs.newLineAtOffset(50, y);
        cs.showText(sanitize("En lettres: " + montantEnLettres(salaireNet) + " Ariary"));
        cs.endText();

        y -= 60;
        drawLine(cs, 50, y, 280, y);
        drawLine(cs, 315, y, 545, y);

        y -= 15;
        cs.beginText();
        cs.setFont(helvetica, 9);
        cs.newLineAtOffset(100, y);
        cs.showText(sanitize("L'employe"));
        cs.endText();

        cs.beginText();
        cs.setFont(helvetica, 9);
        cs.newLineAtOffset(375, y);
        cs.showText(sanitize("Le Directeur"));
        cs.endText();

        cs.close();
        doc.save(file);
        doc.close();

        return file;
    }

    private void drawLine(PDPageContentStream cs, float x1, float y, float x2, float y2) throws IOException {
        cs.moveTo(x1, y);
        cs.lineTo(x2, y2);
        cs.stroke();
    }

    private String sanitize(String text) {
        if (text == null) return "";
        StringBuilder sb = new StringBuilder();
        for (char c : text.toCharArray()) {
            if (c >= 32 && c <= 255) {
                sb.append(c);
            } else if (c == '\u00E9' || c == '\u00C9') { sb.append('e'); }
            else if (c == '\u00E8' || c == '\u00C8') { sb.append('e'); }
            else if (c == '\u00EA' || c == '\u00CA') { sb.append('e'); }
            else if (c == '\u00EB' || c == '\u00CB') { sb.append('e'); }
            else if (c == '\u00E0' || c == '\u00C0') { sb.append('a'); }
            else if (c == '\u00E2' || c == '\u00C2') { sb.append('a'); }
            else if (c == '\u00F4' || c == '\u00D4') { sb.append('o'); }
            else if (c == '\u00FB' || c == '\u00DB') { sb.append('u'); }
            else if (c == '\u00EE' || c == '\u00CE') { sb.append('i'); }
            else if (c == '\u00EF' || c == '\u00CF') { sb.append('i'); }
            else if (c == '\u00E7' || c == '\u00C7') { sb.append('c'); }
            else if (c == '\u00F1' || c == '\u00D1') { sb.append('n'); }
            else { sb.append(' '); }
        }
        return sb.toString();
    }

    private String formatMontant(int montant) {
        String s = String.valueOf(montant);
        StringBuilder result = new StringBuilder();
        int count = 0;
        for (int i = s.length() - 1; i >= 0; i--) {
            result.insert(0, s.charAt(i));
            count++;
            if (count % 3 == 0 && i > 0) {
                result.insert(0, ".");
            }
        }
        return result.toString();
    }

    private String montantEnLettres(int montant) {
        if (montant == 0) return "Zero";
        return convertir(montant).toString().trim();
    }

    private StringBuilder convertir(int montant) {
        String[] units = {"", "Un", "Deux", "Trois", "Quatre", "Cinq", "Six", "Sept", "Huit", "Neuf",
                "Dix", "Onze", "Douze", "Treize", "Quatorze", "Quinze", "Seize", "Dix-sept", "Dix-huit", "Dix-neuf"};
        String[] tens = {"", "", "Vingt", "Trente", "Quarante", "Cinquante", "Soixante", "Soixante-dix",
                "Quatre-vingts", "Quatre-vingt-dix"};

        StringBuilder sb = new StringBuilder();

        if (montant < 20) {
            sb.append(units[montant]);
        } else if (montant < 100) {
            int dizaines = montant / 10;
            int unites = montant % 10;
            if (dizaines == 7) {
                sb.append("Soixante-");
                sb.append(units[10 + unites]);
            } else if (dizaines == 9) {
                sb.append("Quatre-vingt-");
                sb.append(units[10 + unites]);
            } else {
                sb.append(tens[dizaines]);
                if (dizaines == 8 && unites == 0) {
                    sb.setLength(0);
                    sb.append("Quatre-vingts");
                } else if (unites > 0) {
                    sb.append(dizaines == 7 || dizaines == 9 ? "-" : "-et-");
                    sb.append(units[unites]);
                }
            }
        } else if (montant < 1000) {
            int centaines = montant / 100;
            int reste = montant % 100;
            sb.append(centaines == 1 ? "Cent" : convertir(centaines) + " Cent");
            if (reste > 0) {
                sb.append(" ").append(convertir(reste));
            }
        } else {
            int echelle = 0;
            long courant = montant;
            while (courant >= 1000) {
                courant = courant / 1000;
                echelle++;
            }
            long partie = montant;
            for (int i = 0; i < echelle; i++) {
                partie = partie / 1000;
            }
            sb.append(convertir((int) partie));
            if (echelle == 1) {
                sb.append(partie == 1 ? " Mille" : " Mille");
            } else if (echelle == 2) {
                sb.append(partie == 1 ? " Million" : " Millions");
            } else if (echelle == 3) {
                sb.append(partie == 1 ? " Milliard" : " Milliards");
            }
            long reste = montant - partie * (long) Math.pow(1000, echelle);
            if (reste > 0) {
                sb.append(" ").append(convertir((int) reste));
            }
        }
        return sb;
    }
}
