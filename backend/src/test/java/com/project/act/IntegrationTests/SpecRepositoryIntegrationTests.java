package com.project.act.IntegrationTests;

import com.project.act.Entities.Mieszkanie;
import com.project.act.Repositories.MieszkanieRepository;
import com.project.act.Specs.MieszkanieSpecFactory;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.jdbc.Sql;

import java.sql.Timestamp;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Transactional
@Sql("classpath:test-data.sql")
public class SpecRepositoryIntegrationTests {

    @Autowired
    private MieszkanieRepository repo;

    void testQuery(Specification<Mieszkanie> spec, int number){
        var mieszkania = repo.findAll(spec);
        assertThat(mieszkania).hasSize(number);
    }

    @Test
    void testLoadDataFromSqlFile() {
        var mieszkania = repo.findAll();
        assertThat(mieszkania).hasSize(6);
    }

    @Test
    void testQueryByKodPocztowy(){
        var spec = MieszkanieSpecFactory.builder()
                .withKodPocztowy("00-001")
                .getSpec();
        testQuery(spec,1);
    }

    @Test
    void testQueryByUlica(){
        var spec = MieszkanieSpecFactory.builder()
                .withUlica("Długa")
                .getSpec();
        testQuery(spec,2);
    }

    @Test
    void testQueryByMiasto(){
        var spec = MieszkanieSpecFactory.builder()
                .withMiasto("Kraków")
                .getSpec();
        testQuery(spec,1);
    }

    @Test
    void testQueryByNumer(){
        var spec = MieszkanieSpecFactory.builder()
                .withNumer("20")
                .getSpec();
        testQuery(spec,1);
    }

    @Test
    void testQueryByNumerMieszkania(){
        var spec = MieszkanieSpecFactory.builder()
                .withNumerMieszkania("7")
                .getSpec();
        testQuery(spec,3);
    }

    @Test
    void testQueryByNumerDzialki(){
        var spec = MieszkanieSpecFactory.builder()
                .withNumerDzialki("55/3")
                .getSpec();
        testQuery(spec,1);
    }

    @Test
    void testQueryByNumerKsiegiWieczystej(){
        var spec = MieszkanieSpecFactory.builder()
                .withNrKsiegiWieczystej("KW22222")
                .getSpec();
        testQuery(spec,1);
    }

    @Test
    void testQueryByCena(){
        var spec = MieszkanieSpecFactory.builder()
                .withMinPrice(500000d)
                .withMaxPrice(600000d)
                .getSpec();
        testQuery(spec,3);
    }

    @Test
    void testQueryByWadium(){
        var spec = MieszkanieSpecFactory.builder()
                .withMinWadium(12000d)
                .withMaxWadium(50000d)
                .getSpec();
        testQuery(spec,2);
    }

    @Test
    void testQueryByRozmiar(){
        var spec = MieszkanieSpecFactory.builder()
                .withMinRozmiar(1d)
                .withMaxRozmiar(2d)
                .getSpec();
        testQuery(spec,0);
    }

    @Test
    void testQueryByPokoje(){
        var spec = MieszkanieSpecFactory.builder()
                .withMinPokoje(2)
                .withMaxPokoje(2)
                .getSpec();
        testQuery(spec,3);
    }

    @Test
    void testQueryByPietro(){
        var spec = MieszkanieSpecFactory.builder()
                .withMinPietro(0)
                .withMaxPietro(10)
                .getSpec();
        testQuery(spec,6);
    }

    @Test
    void testQueryByPiwnica(){
        var spec = MieszkanieSpecFactory.builder()
                .withPiwnica(Boolean.TRUE)
                .getSpec();
        testQuery(spec,3);
    }

    @Test
    void testQueryByPrawo(){
        var spec = MieszkanieSpecFactory.builder()
                .withPrawo("spółdzielcze")
                .getSpec();
        testQuery(spec,2);
    }

    @Test
    void testQueryByTerminOgledzin(){
        var timestamp1 = Timestamp.valueOf("2025-09-05 09:00:00");
        var timestamp2 = Timestamp.valueOf("2025-09-06 15:30:00");

        var spec = MieszkanieSpecFactory.builder()
                .withMinCzasOgledzin(timestamp1)
                .withMaxCzasOgledzin(timestamp2)
                .getSpec();
        testQuery(spec,2);
    }

}



