package com.project.act.IntegrationTests;

import com.project.act.Entities.Mieszkanie;
import com.project.act.Repositories.MieszkanieRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Transactional
@Sql("classpath:test-data.sql")
public class MieszkanieRepositoryIntegrationTests {

    @Autowired
    private MieszkanieRepository mieszkanieRepository;

    @Test
    void testFindAll() {
        List<Mieszkanie> mieszkania = mieszkanieRepository.findAll();
        assertThat(mieszkania).hasSize(6);
    }

    @Test
    void testFindByMiasto() {
        List<Mieszkanie> mieszkania = mieszkanieRepository.findByMiasto("Kraków");
        assertThat(mieszkania).hasSize(1);
        assertThat(mieszkania.get(0).getMiasto()).isEqualTo("Kraków");
    }

    @Test
    void testSaveMieszkanie() {
        var mieszkanie = new Mieszkanie();
        mieszkanie.setKodPocztowy("00-003");
        mieszkanie.setMiasto("Gdańsk");
        mieszkanie.setUlica("Długa");
        mieszkanie.setNumer("15");
        mieszkanie.setCena(400000.0);

        mieszkanieRepository.save(mieszkanie);

        List<Mieszkanie> mieszkania = mieszkanieRepository.findAll();
        assertThat(mieszkania).hasSize(7);
    }
}