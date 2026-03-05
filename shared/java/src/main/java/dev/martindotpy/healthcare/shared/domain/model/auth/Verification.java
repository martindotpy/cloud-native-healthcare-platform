package dev.martindotpy.healthcare.shared.domain.model.auth;

import java.time.LocalDateTime;
import java.util.UUID;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Verification extends PanacheEntityBase {
    @Id
    @NotNull
    public UUID id;

    @NotBlank
    @Column(columnDefinition = "text")
    public String identifier;
    @NotBlank
    @Column(columnDefinition = "text")
    public String value;
    @NotNull
    public LocalDateTime expiresAt;
    @NotNull
    public LocalDateTime createdAt;
    @NotNull
    public LocalDateTime updatedAt;
}
