package dev.martindotpy.healthcare.appointment.doctor.application.service;

import java.util.UUID;

import dev.martindotpy.healthcare.appointment.doctor.application.usecase.AssignDoctorFacilityUseCase;
import dev.martindotpy.healthcare.appointment.doctor.application.usecase.DoctorAssignmentResult;
import dev.martindotpy.healthcare.shared.domain.model.appointment.Doctor;
import dev.martindotpy.healthcare.shared.domain.model.appointment.Facility;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AssignDoctorFacilityService implements AssignDoctorFacilityUseCase {

    @Override
    public Uni<DoctorAssignmentResult> assign(UUID doctorId, UUID facilityId) {
        if (doctorId == null || facilityId == null) {
            return Uni.createFrom().item(new DoctorAssignmentResult(false, "doctorId y facilityId son obligatorios"));
        }

        return Panache.withTransaction(() -> Doctor.<Doctor>findById(doctorId)
                .onItem().transformToUni(doctor -> {
                    if (doctor == null) {
                        return Uni.createFrom().item(new DoctorAssignmentResult(false, "El medico no existe"));
                    }

                    return Facility.<Facility>findById(facilityId)
                            .onItem().transform(result -> {
                                if (result == null) {
                                    return new DoctorAssignmentResult(false, "La sede no existe");
                                }

                                var alreadyAssigned = doctor.facilities.stream()
                                        .anyMatch(facility -> facility.id.equals(facilityId));

                                if (alreadyAssigned) {
                                    return new DoctorAssignmentResult(true,
                                            "La sede ya estaba asignada al medico");
                                }

                                doctor.facilities.add(result);
                                return new DoctorAssignmentResult(true, "Sede asignada correctamente");
                            });
                }));
    }
}
