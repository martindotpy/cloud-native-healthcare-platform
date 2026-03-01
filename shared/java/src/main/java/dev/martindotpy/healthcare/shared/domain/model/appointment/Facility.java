package dev.martindotpy.healthcare.shared.domain.model.appointment;

import java.util.UUID;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Facility extends PanacheEntityBase {
    @Id
    @NotNull
    public UUID id;

    @NotBlank
    @Column(length = 100)
    public String name;
    @NotBlank
    @Column(columnDefinition = "text")
    public String address;
}
