package dev.martindotpy.healthcare.appointment.doctor.application.usecase;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface AssignDoctorFacilityUseCase {
    Uni<DoctorAssignmentResult> assign(UUID doctorId, UUID facilityId);
}
