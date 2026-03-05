package dev.martindotpy.healthcare.appointment.core.application.usecase;

import io.smallrye.mutiny.Uni;

public interface ValidateAppointmentUseCase {
    Uni<AppointmentValidationResult> validate(AppointmentValidationCommand command);
}
