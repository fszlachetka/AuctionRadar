package com.project.act.Repositories;

import com.project.act.Entities.Mieszkanie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface MieszkanieRepository extends JpaRepository<Mieszkanie, Long>, JpaSpecificationExecutor<Mieszkanie> {
    List<Mieszkanie> findByMiasto(String miasto);
}
