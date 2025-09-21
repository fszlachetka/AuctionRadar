package com.project.act.Repositories;

import com.project.act.Entities.Obserwowane;
import com.project.act.Entities.ObserwowaneId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ObserwowaneRepository extends JpaRepository<Obserwowane, ObserwowaneId> {
}
