package dev.martindotpy.healthcare.appointment.doctor.application.service;

import java.util.UUID;

import dev.martindotpy.healthcare.appointment.doctor.application.usecase.AssignDoctorSpecialtyUseCase;
import dev.martindotpy.healthcare.appointment.doctor.application.usecase.DoctorAssignmentResult;
import dev.martindotpy.healthcare.shared.domain.model.appointment.Doctor;
import dev.martindotpy.healthcare.shared.domain.model.appointment.Specialty;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AssignDoctorSpecialtyService implements AssignDoctorSpecialtyUseCase {

    @Override
    public Uni<DoctorAssignmentResult> assign(UUID doctorId, UUID specialtyId) {
        if (doctorId == null || specialtyId == null) {
            return Uni.createFrom().item(new DoctorAssignmentResult(false, "doctorId y specialtyId son obligatorios"));
        }

        return Panache.withTransaction(() -> Doctor.<Doctor>findById(doctorId)
                .onItem().transformToUni(doctor -> {
                    if (doctor == null) {
                        return Uni.createFrom().item(new DoctorAssignmentResult(false, "El medico no existe"));
                    }

                    return Specialty.<Specialty>findById(specialtyId)
                            .onItem().transform(result -> {
                                if (result == null) {
                                    return new DoctorAssignmentResult(false, "La especialidad no existe");
                                }

                                var alreadyAssigned = doctor.specialties.stream()
                                        .anyMatch(specialty -> specialty.id.equals(specialtyId));

                                if (alreadyAssigned) {
                                    return new DoctorAssignmentResult(true,
                                            "La especialidad ya estaba asignada al medico");
                                }

                                doctor.specialties.add(result);
                                return new DoctorAssignmentResult(true, "Especialidad asignada correctamente");
                            });
                }));
    }
}
