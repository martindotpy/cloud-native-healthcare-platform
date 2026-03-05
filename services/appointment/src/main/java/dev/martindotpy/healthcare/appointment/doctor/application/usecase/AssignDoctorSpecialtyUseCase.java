package dev.martindotpy.healthcare.appointment.doctor.application.usecase;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface AssignDoctorSpecialtyUseCase {
    Uni<DoctorAssignmentResult> assign(UUID doctorId, UUID specialtyId);
}
