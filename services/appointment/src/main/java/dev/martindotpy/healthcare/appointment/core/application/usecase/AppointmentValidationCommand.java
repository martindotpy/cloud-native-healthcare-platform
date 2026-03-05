package dev.martindotpy.healthcare.appointment.core.application.usecase;

import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentValidationCommand(
        UUID doctorId,
        UUID facilityId,
        LocalDateTime scheduledDate,
        UUID appointmentId) {
}
