package dev.martindotpy.healthcare.appointment.core.application.usecase;

public record AppointmentValidationResult(
        boolean valid,
        boolean dateInPast,
        boolean doctorAssignedToFacility,
        boolean hasConflict,
        String message) {
}
