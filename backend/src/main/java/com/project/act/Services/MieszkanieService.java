package com.project.act.Services;

import com.project.act.DTOs.MieszkanieCreateDTO;
import com.project.act.DTOs.MieszkanieGetDTO;
import com.project.act.Entities.Mieszkanie;
import com.project.act.Repositories.MieszkanieRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MieszkanieService {

    private final MieszkanieRepository mieszkanieRepository;

    public MieszkanieService(MieszkanieRepository mieszkanieRepository) {
        this.mieszkanieRepository = mieszkanieRepository;
    }
    private MieszkanieGetDTO mapToResponseDTO(Mieszkanie mieszkanie) {
        return new MieszkanieGetDTO(
                mieszkanie.getMieszkanieId(),
                mieszkanie.getKodPocztowy(),
                mieszkanie.getMiasto(),
                mieszkanie.getUlica(),
                mieszkanie.getNumer(),
                mieszkanie.getNumerMieszkania(),
                mieszkanie.getNrDzialki(),
                mieszkanie.getNrKsiegiWieczystej(),
                mieszkanie.getRozmiar(),
                mieszkanie.getPokoje(),
                mieszkanie.getPietro(),
                mieszkanie.getPiwnica(),
                mieszkanie.getCena(),
                mieszkanie.getWadium(),
                mieszkanie.getPrawo(),
                mieszkanie.getInne(),
                mieszkanie.getTerminOgledzin()
        );
    }

    public List<MieszkanieGetDTO> getAllMieszkania() {
        return mieszkanieRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public MieszkanieGetDTO createMieszkanie(MieszkanieCreateDTO dto) {
        Mieszkanie mieszkanie = new Mieszkanie();
        mieszkanie.setKodPocztowy(dto.getKodPocztowy());
        mieszkanie.setMiasto(dto.getMiasto());
        mieszkanie.setUlica(dto.getUlica());
        mieszkanie.setNumer(dto.getNumer());
        mieszkanie.setNumerMieszkania(dto.getNumerMieszkania());
        mieszkanie.setNrDzialki(dto.getNrDzialki());
        mieszkanie.setNrKsiegiWieczystej(dto.getNrKsiegiWieczystej());
        mieszkanie.setRozmiar(dto.getRozmiar());
        mieszkanie.setPokoje(dto.getPokoje());
        mieszkanie.setPietro(dto.getPietro());
        mieszkanie.setPiwnica(dto.getPiwnica());
        mieszkanie.setCena(dto.getCena());
        mieszkanie.setWadium(dto.getWadium());
        mieszkanie.setTerminOgledzin(dto.getTerminOgledzin());

        Mieszkanie saved = mieszkanieRepository.save(mieszkanie);
        return mapToResponseDTO(saved);
    }
}