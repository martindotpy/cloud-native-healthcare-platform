package dev.martindotpy.healthcare.appointment.core.application.usecase;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface DeleteAppointmentUseCase {
    Uni<Boolean> delete(UUID appointmentId);
}
