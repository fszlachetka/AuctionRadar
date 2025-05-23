package com.project.act.Entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    private Long userId;

    @Column(name="login")
    private String login;

    @Column(name="passwd")
    private String passwd;

    @OneToMany(mappedBy = "user")
    private Set<Obserwowane> obserwowane;
}
