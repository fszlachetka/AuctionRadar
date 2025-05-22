package com.project.act.Entities;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
public class ObserwowaneId implements Serializable {

    private Long userId;
    private Long mieszkanieId;

    public ObserwowaneId() {}

    public ObserwowaneId(Long userId, Long mieszkanieId) {
        this.userId = userId;
        this.mieszkanieId = mieszkanieId;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ObserwowaneId that)) return false;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(mieszkanieId, that.mieszkanieId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, mieszkanieId);
    }
}
