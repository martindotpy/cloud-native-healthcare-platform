package dev.martindotpy.healthcare.shared.domain.model.auth;

import java.time.LocalDateTime;
import java.util.UUID;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import io.smallrye.common.constraint.NotNull;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Account extends PanacheEntityBase {
    @Id
    @NotNull
    public UUID id;

    @NotBlank
    @Column(columnDefinition = "text")
    public String accountId;
    @NotBlank
    @Column(columnDefinition = "text")
    public String providerId;
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    public User user;
    @Column(columnDefinition = "text")
    public String accessToken;
    @Column(columnDefinition = "text")
    public String refreshToken;
    @Column(columnDefinition = "text")
    public String idToken;
    public LocalDateTime accessTokenExpiresAt;
    public LocalDateTime refreshTokenExpiresAt;
    @Column(columnDefinition = "text")
    public String scope;
    @Column(columnDefinition = "text")
    public String password;
    @NotNull
    public LocalDateTime createdAt;
    @NotNull
    public LocalDateTime updatedAt;
}
