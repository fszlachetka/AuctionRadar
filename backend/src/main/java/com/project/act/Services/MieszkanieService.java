package com.project.act.Services;

import com.project.act.DTOs.MieszkanieCreateDTO;
import com.project.act.DTOs.MieszkanieFilterDTO;
import com.project.act.DTOs.MieszkanieGetDTO;
import com.project.act.Entities.Mieszkanie;
import com.project.act.Repositories.MieszkanieRepository;
import com.project.act.Specs.MieszkanieSpecFactory;
import org.springframework.data.jpa.domain.Specification;
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
                mieszkanie.getTerminOgledzin(),
                mieszkanie.getXCoord(),
                mieszkanie.getYCoord()
        );
    }

    public List<MieszkanieGetDTO> getAllMieszkanie() {
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
        mieszkanie.setXCoord(dto.getXCoord());
        mieszkanie.setYCoord(dto.getYCoord());

        Mieszkanie saved = mieszkanieRepository.save(mieszkanie);
        return mapToResponseDTO(saved);
    }

    public List<MieszkanieGetDTO> filterAndGetMieszkania(MieszkanieFilterDTO mieszkanieFilterDTO){
        Specification<Mieszkanie> spec = MieszkanieSpecFactory.builder()
                .withKodPocztowy(mieszkanieFilterDTO.getKodPocztowy())
                .withMiasto(mieszkanieFilterDTO.getMiasto())
                .withNumer(mieszkanieFilterDTO.getNumer())
                .withNumerMieszkania(mieszkanieFilterDTO.getNumerMieszkania())
                .withNumerDzialki(mieszkanieFilterDTO.getNrDzialki())
                .withNrKsiegiWieczystej(mieszkanieFilterDTO.getNrKsiegiWieczystej())
                .withPiwnica(mieszkanieFilterDTO.getHasPiwinca())
                .withPrawo(mieszkanieFilterDTO.getPrawo())
                .withUlica(mieszkanieFilterDTO.getUlica())
                .withMaxPietro(mieszkanieFilterDTO.getMaxPietro())
                .withMinPietro(mieszkanieFilterDTO.getMinPietro())
                .withMaxPokoje(mieszkanieFilterDTO.getMaxPokoje())
                .withMinPokoje(mieszkanieFilterDTO.getMinPokoje())
                .withMaxRozmiar(mieszkanieFilterDTO.getMaxRozmiar())
                .withMinRozmiar(mieszkanieFilterDTO.getMinRozmiar())
                .withMaxPrice(mieszkanieFilterDTO.getMaxCena())
                .withMinPrice(mieszkanieFilterDTO.getMinCena())
                .withMaxWadium(mieszkanieFilterDTO.getMaxWadium())
                .withMinWadium(mieszkanieFilterDTO.getMinWadium())
                .withMinCzasOgledzin(mieszkanieFilterDTO.getMinTerminOgledzin())
                .withMaxCzasOgledzin(mieszkanieFilterDTO.getMaxTerminOgledzin())
                .getSpec();

        return mieszkanieRepository.findAll(spec)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

}