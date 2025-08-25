package com.project.act.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class MieszkanieGetDTO {
    private Long mieszkanieId;

    private String kodPocztowy;

    private String miasto;

    private String ulica;

    private String numer;

    private String numerMieszkania;

    private String nrDzialki;

    private String nrKsiegiWieczystej;

    private Integer rozmiar;

    private Integer pokoje;

    private Integer pietro;

    private Boolean piwnica;

    private Integer cena;

    private Integer wadium;

    private String prawo;

    private String inne;

    private Timestamp terminOgledzin;
}
