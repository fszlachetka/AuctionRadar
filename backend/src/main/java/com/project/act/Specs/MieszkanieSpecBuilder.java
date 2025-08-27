package com.project.act.Specs;

import com.project.act.Entities.Mieszkanie;
import org.springframework.data.jpa.domain.Specification;

public class MieszkanieSpecBuilder {
    private Specification<Mieszkanie> spec;

    public Specification<Mieszkanie> getSpec(){
        return this.spec;
    }

    private MieszkanieSpecBuilder(){
        this.spec = Specification.where(null);
    }

    public static MieszkanieSpecBuilder builder() {
        return new MieszkanieSpecBuilder();
    }

    private <T> void equalsNotNull(T value, String fieldName){
        if(value != null){
            this.spec = spec.and((root,query,cb) -> cb.equal(root.get(fieldName), value));
        }
    }

    private <T extends Number> void greaterEqualNotNull(T value, String fieldName){
        if(value != null){
            this.spec = spec.and((root, query, cb) -> cb.ge(root.get(fieldName), value));
        }
    }

    private <T extends Number> void lessEqualNotNull(T value, String fieldName){
        if(value != null){
            this.spec = spec.and((root, query, cb) -> cb.le(root.get(fieldName), value));
        }
    }

    public MieszkanieSpecBuilder withKodPocztowy (String kodPocztowy){
        equalsNotNull(kodPocztowy, "kodPocztowy");
        return this;
    }

    public MieszkanieSpecBuilder withMiasto (String miasto){
        equalsNotNull(miasto, "miasto");
        return this;
    }

    public MieszkanieSpecBuilder withNumer (String numer){
        equalsNotNull(numer, "numer");
        return this;
    }

    public MieszkanieSpecBuilder withNumerMieszkania(String numerMieszkania){
        equalsNotNull(numerMieszkania, "numerMieszkania");
        return this;
    }

    public MieszkanieSpecBuilder withUlica(String ulica){
        equalsNotNull(ulica, "ulica");
        return this;
    }

    public MieszkanieSpecBuilder withNumerDzialki(String numerDzialki){
        equalsNotNull(numerDzialki, "numerDzialki");
        return this;
    }

    public MieszkanieSpecBuilder withNrKsiegiWieczystej(String nrKsiegiWieczystej){
        equalsNotNull(nrKsiegiWieczystej, "nrKsiegiWieczystej");
        return this;
    }

    public MieszkanieSpecBuilder withPrawo(String prawo){
        equalsNotNull(prawo, "prawo");
        return this;
    }

    public MieszkanieSpecBuilder withPiwnica(Boolean piwnica){
        equalsNotNull(piwnica, "piwnica");
        return this;
    }

    public MieszkanieSpecBuilder withMaxPrice(Double maxCena){
        lessEqualNotNull(maxCena, "cena");
        return this;
    }

    public MieszkanieSpecBuilder withMinPrice(Double minCena){
        greaterEqualNotNull(minCena, "cena");
        return this;
    }

    public MieszkanieSpecBuilder withMaxWadium(Double maxWadium){
        lessEqualNotNull(maxWadium, "wadium");
        return this;
    }

    public MieszkanieSpecBuilder withMinWadium(Double minWadium){
        greaterEqualNotNull(minWadium, "wadium");
        return this;
    }

    public MieszkanieSpecBuilder withMaxRozmiar(Double maxRozmiar){
        lessEqualNotNull(maxRozmiar, "rozmiar");
        return this;
    }

    public MieszkanieSpecBuilder withMinRozmiar(Double minRozmiar){
        greaterEqualNotNull(minRozmiar, "rozmiar");
        return this;
    }

    public MieszkanieSpecBuilder withMaxPokoje(Integer maxPokoje){
        lessEqualNotNull(maxPokoje, "pokoje");
        return this;
    }

    public MieszkanieSpecBuilder withMinPokoje(Integer minPokoje){
        greaterEqualNotNull(minPokoje, "pokoje");
        return this;
    }

    public MieszkanieSpecBuilder withMaxPietro(Integer maxPietro){
        lessEqualNotNull(maxPietro, "pietro");
        return this;
    }

    public MieszkanieSpecBuilder withMinPietro(Integer minPietro){
        greaterEqualNotNull(minPietro, "pietro");
        return this;
    }
}
