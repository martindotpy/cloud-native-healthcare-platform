package dev.martindotpy.healthcare.shared.domain.model.ehr;

import java.util.UUID;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = "national_id")
})
public class Patient extends PanacheEntityBase {
    @Id
    @NotNull
    public UUID id;

    @NotBlank
    @Column(length = 8)
    public String nationalId;

    @NotBlank
    @Column(length = 9)
    public String phone;
}
