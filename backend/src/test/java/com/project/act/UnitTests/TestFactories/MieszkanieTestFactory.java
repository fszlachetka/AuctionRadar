package com.project.act.UnitTests.TestFactories;

import com.project.act.DTOs.MieszkanieCreateDTO;
import com.project.act.DTOs.MieszkanieFilterDTO;
import com.project.act.DTOs.MieszkanieGetDTO;
import com.project.act.Entities.Mieszkanie;
import com.project.act.Specs.MieszkanieSpecFactory;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.sql.Timestamp;

public class MieszkanieTestFactory {

    private static final Timestamp timestampTest = Timestamp.valueOf("2025-09-03 11:30:00");
    public static MieszkanieCreateDTO defaultMieszkanieCreateDTO(){
        return new MieszkanieCreateDTO(
                "30-142", "Kraków", "Krótka",
                "6a", "4", "NR/123", "KR12312/421",
                71.23, 3, 3, true, 1100000d, 110000d,
                "własność", "abc" , timestampTest,null,null
        );
    }

    public static MieszkanieGetDTO defaultMieszkanieGetDTO(){
        return new MieszkanieGetDTO(
                2L, "31-503", "Kraków", "Galicyjska",
                "1", null, "123", "KR/456",
                157.23, 6, 0, true, 2200000d, 220000d,
                "własność", "efg", timestampTest, null, null
        );
    }

    public static MieszkanieFilterDTO defaultMieszkanieFilterDTO(){
        MieszkanieFilterDTO dto = new MieszkanieFilterDTO();
        dto.setMinCena(100d);
        dto.setMaxCena(10000000d);
        return dto;
    }

    public static Specification<Mieszkanie> defaultMieszkanieSpec(){
        return MieszkanieSpecFactory.builder()
                .withMinPrice(100d)
                .withMaxPrice(10000000d)
                .getSpec();
    }
}
