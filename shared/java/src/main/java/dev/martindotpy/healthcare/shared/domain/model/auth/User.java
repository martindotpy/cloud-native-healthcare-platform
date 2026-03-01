package dev.martindotpy.healthcare.shared.domain.model.auth;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import dev.martindotpy.healthcare.shared.domain.model.auth.enums.UserRole;
import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import io.smallrye.common.constraint.NotNull;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "\"user\"")
public class User extends PanacheEntityBase {
    @Id
    @NotNull
    public UUID id;

    @NotBlank
    @Column(columnDefinition = "text")
    public String name;
    @Email
    @NotBlank
    @Schema(format = "email")
    @Column(columnDefinition = "text")
    public String email;
    @NotNull
    public boolean emailVerified = false;
    @Column(columnDefinition = "text")
    public String image;
    @CreationTimestamp
    @Column(updatable = false)
    public LocalDateTime createdAt;
    @NotNull
    @UpdateTimestamp
    public LocalDateTime updatedAt;
    @Column(columnDefinition = "text")
    @Enumerated(EnumType.STRING)
    public UserRole role;
    @NotNull
    public boolean banned = false;
    @Column(columnDefinition = "text")
    public String banReason;
    public LocalDateTime banExpires;
    @NotNull
    @Column(columnDefinition = "text")
    public String lastName;

    @OneToMany(mappedBy = "user")
    public List<Account> accounts;
}
