package dev.martindotpy.healthcare.shared.domain.model.insurance;

import java.util.UUID;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

@Entity
public class InsuranceProvider extends PanacheEntityBase {
    @Id
    public UUID id;

    @NotNull
    @Column(length = 100)
    public String name;
    @Column(columnDefinition = "text")
    public String coverageDetails;
}
