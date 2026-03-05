package dev.martindotpy.healthcare.shared.domain.model.insurance;

import java.math.BigDecimal;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = "appointment_id")
})
public class Invoice extends PanacheEntityBase {
    @Id
    @NotNull
    public UUID id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    public Appointment appointment;
    @ManyToOne(fetch = FetchType.LAZY)
    public InsuranceProvider insuranceProvider;
    @NotNull
    @Column(precision = 10, scale = 2)
    public BigDecimal totalAmount;
    @NotNull
    @Column(length = 50)
    public String paymentMethod;
    @CreationTimestamp
    @Column(updatable = false)
    public LocalDateTime issuedAt;
}
