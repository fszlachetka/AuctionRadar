package com.project.act.DTOs;

import lombok.*;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class MieszkanieFilterDTO {
    private String kodPocztowy;

    private String miasto;

    private String ulica;

    private String numer;

    private String numerMieszkania;

    private String nrDzialki;

    private String nrKsiegiWieczystej;

    private Double minCena;

    private Double maxCena;

    private Double minWadium;

    private Double maxWadium;

    private Double minRozmiar;

    private Double maxRozmiar;

    private Integer minPokoje;

    private Integer maxPokoje;

    private Integer minPietro;

    private Integer maxPietro;

    private Boolean hasPiwinca;

    private String prawo;

    private Timestamp  minTerminOgledzin;

    private Timestamp maxTerminOgledzin;
}
