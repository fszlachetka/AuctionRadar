package com.project.act.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "obserwowane")
@Getter
@Setter
public class Obserwowane {
    @EmbeddedId
    private ObserwowaneId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("mieszkanieId")
    @JoinColumn(name = "mieszkanie_id")
    private Mieszkanie mieszkanie;
}
