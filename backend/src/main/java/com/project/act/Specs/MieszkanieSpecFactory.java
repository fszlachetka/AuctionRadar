package com.project.act.Specs;

import com.project.act.Entities.Mieszkanie;
import org.springframework.data.jpa.domain.Specification;

import java.sql.Timestamp;

public class MieszkanieSpecFactory {
    private Specification<Mieszkanie> spec;

    public Specification<Mieszkanie> getSpec(){
        return this.spec;
    }

    private MieszkanieSpecFactory(){
        this.spec = Specification.where(null);
    }

    public static MieszkanieSpecFactory builder() {
        return new MieszkanieSpecFactory();
    }

    private void equalsIgnoreCaseNotNull(String value, String fieldName) {
        if (value != null && !value.isEmpty()) {
            this.spec = spec.and((root, query, cb) ->
                    cb.equal(cb.lower((root.get(fieldName))), value.toLowerCase()));
        }
    }

    private <T> void equalsNotNull(T value, String fieldName){
        if(value != null){
            this.spec = spec.and((root,query,cb) -> cb.equal(root.get(fieldName), value));
        }
    }
    private <T extends Comparable<? super T>> void greaterEqualNotNull(T value, String fieldName){
        if(value != null){
            this.spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get(fieldName), value));
        }
    }

    private <T extends Comparable<? super T>> void lessEqualNotNull(T value, String fieldName){
        if(value != null){
            this.spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get(fieldName), value));
        }
    }

    public MieszkanieSpecFactory withKodPocztowy (String kodPocztowy){
        equalsIgnoreCaseNotNull(kodPocztowy, "kodPocztowy");
        return this;
    }

    public MieszkanieSpecFactory withMiasto (String miasto){
        equalsIgnoreCaseNotNull(miasto, "miasto");
        return this;
    }

    public MieszkanieSpecFactory withNumer (String numer){
        equalsIgnoreCaseNotNull(numer, "numer");
        return this;
    }

    public MieszkanieSpecFactory withNumerMieszkania(String numerMieszkania){
        equalsIgnoreCaseNotNull(numerMieszkania, "numerMieszkania");
        return this;
    }

    public MieszkanieSpecFactory withUlica(String ulica){
        equalsIgnoreCaseNotNull(ulica, "ulica");
        return this;
    }

    public MieszkanieSpecFactory withNumerDzialki(String numerDzialki){
        equalsIgnoreCaseNotNull(numerDzialki, "nrDzialki");
        return this;
    }

    public MieszkanieSpecFactory withNrKsiegiWieczystej(String nrKsiegiWieczystej){
        equalsIgnoreCaseNotNull(nrKsiegiWieczystej, "nrKsiegiWieczystej");
        return this;
    }

    public MieszkanieSpecFactory withPrawo(String prawo){
        equalsIgnoreCaseNotNull(prawo, "prawo");
        return this;
    }

    public MieszkanieSpecFactory withPiwnica(Boolean piwnica){
        equalsNotNull(piwnica, "piwnica");
        return this;
    }

    public MieszkanieSpecFactory withMaxPrice(Double maxCena){
        lessEqualNotNull(maxCena, "cena");
        return this;
    }

    public MieszkanieSpecFactory withMinPrice(Double minCena){
        greaterEqualNotNull(minCena, "cena");
        return this;
    }

    public MieszkanieSpecFactory withMaxWadium(Double maxWadium){
        lessEqualNotNull(maxWadium, "wadium");
        return this;
    }

    public MieszkanieSpecFactory withMinWadium(Double minWadium){
        greaterEqualNotNull(minWadium, "wadium");
        return this;
    }

    public MieszkanieSpecFactory withMaxRozmiar(Double maxRozmiar){
        lessEqualNotNull(maxRozmiar, "rozmiar");
        return this;
    }

    public MieszkanieSpecFactory withMinRozmiar(Double minRozmiar){
        greaterEqualNotNull(minRozmiar, "rozmiar");
        return this;
    }

    public MieszkanieSpecFactory withMaxPokoje(Integer maxPokoje){
        lessEqualNotNull(maxPokoje, "pokoje");
        return this;
    }

    public MieszkanieSpecFactory withMinPokoje(Integer minPokoje){
        greaterEqualNotNull(minPokoje, "pokoje");
        return this;
    }

    public MieszkanieSpecFactory withMaxPietro(Integer maxPietro){
        lessEqualNotNull(maxPietro, "pietro");
        return this;
    }

    public MieszkanieSpecFactory withMinPietro(Integer minPietro){
        greaterEqualNotNull(minPietro, "pietro");
        return this;
    }

    public MieszkanieSpecFactory withMinCzasOgledzin(Timestamp minCzasOgledzin){
        greaterEqualNotNull(minCzasOgledzin, "terminOgledzin");
        return this;
    }

    public MieszkanieSpecFactory withMaxCzasOgledzin(Timestamp maxCzasOgledzin){
        lessEqualNotNull(maxCzasOgledzin, "terminOgledzin");
        return this;
    }
}
