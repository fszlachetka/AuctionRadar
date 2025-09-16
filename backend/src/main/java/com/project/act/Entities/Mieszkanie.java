package com.project.act.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Set;

@Entity
@Data
@Table(name="mieszkania")
@AllArgsConstructor
@NoArgsConstructor
public class Mieszkanie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="mieszkanie_id")
    private Long mieszkanieId;

    @Column(name="kod_pocztowy")
    private String kodPocztowy;

    @Column(name="miasto")
    private String miasto;

    @Column(name="ulica")
    private String ulica;

    @Column(name="numer")
    private String numer;

    @Column(name="numer_mieszkania")
    private String numerMieszkania;

    @Column(name="nr_dzialki")
    private String nrDzialki;

    @Column(name="nr_ksiegi_wieczystej")
    private String nrKsiegiWieczystej;

    @Column(name="cena")
    private Double cena;

    @Column(name="wadium")
    private Double wadium;

    @Column(name="rozmiar")
    private Double rozmiar;

    @Column(name="pokoje")
    private Integer pokoje;

    @Column(name="pietro")
    private Integer pietro;

    @Column(name="piwnica")
    private Boolean piwnica;

    @Column(name="prawo")
    private String prawo;

    @Column(name="inne")
    private String inne;

    @Column(name="termin_ogledzin")
    private Timestamp terminOgledzin;

    @Column(name="xCoord")
    private String xCoord;

    @Column(name="yCoord")
    private String yCoord;

    @OneToMany(mappedBy = "mieszkanie", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Obserwowane> obserwowane;
}
