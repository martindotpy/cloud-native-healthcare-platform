package dev.martindotpy.healthcare.shared.domain.model.ehr;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Prescription extends PanacheEntityBase {
    @Id
    @NotNull
    public UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    public ClinicalEpisode clinicalEpisode;

    @NotBlank
    @Column(columnDefinition = "text")
    public String medicationDetails;

    @NotBlank
    @Column(columnDefinition = "text")
    public String instructions;

    @CreationTimestamp
    public LocalDateTime issuedAt;
}
