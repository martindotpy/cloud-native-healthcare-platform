package dev.martindotpy.healthcare.shared.domain.model.appointment;

import java.time.LocalDateTime;
import java.util.UUID;

import dev.martindotpy.healthcare.shared.domain.model.appointment.enums.AppointmentStatus;
import dev.martindotpy.healthcare.shared.domain.model.ehr.Patient;
import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;

@Entity
public class Appointment extends PanacheEntityBase {
    @Id
    @NotNull
    public UUID id;

    @NotNull
    @ManyToOne
    public Patient patient;
    @NotNull
    @ManyToOne
    public Doctor doctor;
    @NotNull
    @ManyToOne
    public Facility facility;
    @NotNull
    public LocalDateTime scheduledDate;
    @Enumerated(EnumType.STRING)
    public AppointmentStatus status;
}
