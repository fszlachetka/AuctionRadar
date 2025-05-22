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
    private Long mieszkanie_id;

    @Column(name="rozmiar")
    private Long rozmiar;

    @Column(name="pokoje")
    private Long pokoje;

    @Column(name="ulica")
    private String ulica;

    @Column(name="miasto")
    private String miasto;

    @Column(name="nr_ksiegi_wieczystej")
    private String nrKsiegiWieczystej;

    @Column(name="wadium")
    private Long wadium;

    @Column(name="pietro")
    private Long pietro;

    @Column(name="piwnica")
    private Long piwnica;

    @Column(name="prawo")
    private String prawo;

    @Column(name="nr_dzialki")
    private String nr_dzialki;

    @Column(name="inne")
    private String inne;

    @Column(name="termin_ogledzin")
    private Timestamp termin_ogledzin;

    @OneToMany(mappedBy = "mieszkanie")
    private Set<Obserwowane> obserwowane;
}
