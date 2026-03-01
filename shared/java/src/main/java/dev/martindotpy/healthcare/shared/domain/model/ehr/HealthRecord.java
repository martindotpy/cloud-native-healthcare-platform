package dev.martindotpy.healthcare.shared.domain.model.ehr;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import dev.martindotpy.healthcare.shared.domain.model.ehr.enums.HealthRecordStatus;
import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = "patient_id")
})
public class HealthRecord extends PanacheEntityBase {
    @Id
    @NotNull
    public UUID id;

    @Enumerated(EnumType.STRING)
    public HealthRecordStatus status = HealthRecordStatus.ACTIVE;
    @CreationTimestamp
    @Column(updatable = false)
    public LocalDateTime createdAt;

    @NotNull
    @OneToOne
    public Patient patient;
}
