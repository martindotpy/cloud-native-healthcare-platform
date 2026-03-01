package dev.martindotpy.healthcare.shared.domain.model.ehr;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import dev.martindotpy.healthcare.shared.domain.model.appointment.Appointment;
import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class ClinicalEpisode extends PanacheEntityBase {
    @Id
    @NotNull
    public UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    public HealthRecord healthRecord;
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    public Appointment appointment;
    @NotBlank
    @Column(columnDefinition = "text")
    public String diagnosis;
    @Column(columnDefinition = "text")
    public String treatmentPlan;
    @CreationTimestamp
    @Column(updatable = false)
    public LocalDateTime recordedAt;
}
