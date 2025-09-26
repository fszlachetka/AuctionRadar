package com.project.act.IntegrationTests;

import com.project.act.DTOs.MieszkanieCreateDTO;
import com.project.act.DTOs.MieszkanieFilterDTO;
import com.project.act.Services.MieszkanieService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@Sql(scripts = "classpath:test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@Sql(statements = "DELETE FROM mieszkania", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
public class MieszkanieServiceIntegrationTests {

    @Autowired
    private MieszkanieService mieszkanieService;

    @Test
    void testGetAllMieszkanie() {
        var mieszkania = mieszkanieService.getAllMieszkanie();
        assertThat(mieszkania).hasSize(6);
    }

    @Test
    void testCreateMieszkanie() {
        MieszkanieCreateDTO dto = new MieszkanieCreateDTO();
        dto.setKodPocztowy("00-002");
        dto.setMiasto("Warszawa");
        dto.setUlica("Nowa");
        dto.setNumer("10");
        dto.setCena(500000.0);

        var created = mieszkanieService.createMieszkanie(dto);
        assertThat(created.getMiasto()).isEqualTo("Warszawa");
        assertThat(created.getCena()).isEqualTo(500000.0);

        var allMieszkania = mieszkanieService.getAllMieszkanie();
        assertThat(allMieszkania).hasSize(7);
    }

    @Test
    void testGetMieszkanieById() {
        var mieszkanie = mieszkanieService.getMieszkanieById(1L);
        assertThat(mieszkanie.getMiasto()).isEqualTo("Warszawa");
    }

    @Test
    void testFilterAndGetMieszkania() {
        MieszkanieFilterDTO filter = new MieszkanieFilterDTO();
        filter.setMiasto("Kraków");

        var filtered = mieszkanieService.filterAndGetMieszkania(filter);
        assertThat(filtered).hasSize(1);
        assertThat(filtered.get(0).getMiasto()).isEqualTo("Kraków");
    }
}