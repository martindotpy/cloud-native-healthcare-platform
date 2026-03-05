package dev.martindotpy.healthcare.appointment.core.application.service;

import java.time.LocalDateTime;

import dev.martindotpy.healthcare.appointment.core.application.usecase.AppointmentValidationCommand;
import dev.martindotpy.healthcare.appointment.core.application.usecase.AppointmentValidationResult;
import dev.martindotpy.healthcare.appointment.core.application.usecase.ValidateAppointmentUseCase;
import dev.martindotpy.healthcare.shared.domain.model.appointment.Appointment;
import dev.martindotpy.healthcare.shared.domain.model.appointment.Doctor;
import dev.martindotpy.healthcare.shared.domain.model.appointment.enums.AppointmentStatus;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ValidateAppointmentService implements ValidateAppointmentUseCase {

    @Override
    @WithSession
    public Uni<AppointmentValidationResult> validate(AppointmentValidationCommand command) {
        if (command == null || command.doctorId() == null || command.facilityId() == null
                || command.scheduledDate() == null) {
            return Uni.createFrom().item(new AppointmentValidationResult(false, false, false, false,
                    "doctorId, facilityId y scheduledDate son obligatorios"));
        }

        if (command.scheduledDate().isBefore(LocalDateTime.now())) {
            return Uni.createFrom().item(new AppointmentValidationResult(false, true, false, false,
                    "No se puede agendar una cita en fecha pasada"));
        }

        return Doctor.<Doctor>findById(command.doctorId())
                .onItem().transformToUni(doctor -> {
                    if (doctor == null) {
                        return Uni.createFrom().item(new AppointmentValidationResult(false, false, false, false,
                                "El medico no existe"));
                    }

                    var doctorAssignedToFacility = doctor.facilities.stream()
                            .anyMatch(facility -> facility.id.equals(command.facilityId()));

                    if (!doctorAssignedToFacility) {
                        return Uni.createFrom().item(new AppointmentValidationResult(false, false, true, false,
                                "El medico no atiende en la sede seleccionada"));
                    }

                    Uni<Long> conflicts = command.appointmentId() == null
                            ? Appointment.count(
                                    "doctor.id = ?1 and scheduledDate = ?2 and status <> ?3",
                                    command.doctorId(), command.scheduledDate(), AppointmentStatus.canceled)
                            : Appointment.count(
                                    "doctor.id = ?1 and scheduledDate = ?2 and status <> ?3 and id <> ?4",
                                    command.doctorId(), command.scheduledDate(), AppointmentStatus.canceled,
                                    command.appointmentId());

                    return conflicts.onItem().transform(conflictCount -> {
                        if (conflictCount > 0) {
                            return new AppointmentValidationResult(false, false, true, true,
                                    "El medico ya tiene una cita en la fecha y hora indicada");
                        }

                        return new AppointmentValidationResult(true, false, true, false, "Horario disponible");
                    });
                });
    }
}
