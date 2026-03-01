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
public class Jwks extends PanacheEntityBase {
    @Id
    @NotNull
    public UUID id;

    @NotBlank
    @Column(columnDefinition = "text")
    public String publicKey;
    @NotBlank
    @Column(columnDefinition = "text")
    public String privateKey;
    @NotNull
    public LocalDateTime createdAt;
    public LocalDateTime expiresAt;
}
