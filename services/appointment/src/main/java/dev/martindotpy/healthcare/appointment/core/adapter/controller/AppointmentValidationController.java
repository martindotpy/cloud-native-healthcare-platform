package dev.martindotpy.healthcare.appointment.core.adapter.controller;

import java.time.LocalDateTime;
import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.appointment.Appointment;
import dev.martindotpy.healthcare.shared.domain.model.appointment.Doctor;
import dev.martindotpy.healthcare.shared.domain.model.appointment.enums.AppointmentStatus;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/appointment")
@Tag(name = "Appointment")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AppointmentValidationController {

    @POST
    @Path("/validate")
    @Operation(summary = "Validate appointment scheduling rules")
    @APIResponse(responseCode = "200", description = "Validation result", content = @Content(schema = @Schema(implementation = AppointmentValidationResponse.class)))
    public Uni<AppointmentValidationResponse> validate(AppointmentValidationRequest request) {
        if (request == null || request.doctorId() == null || request.facilityId() == null
                || request.scheduledDate() == null) {
            return Uni.createFrom().item(new AppointmentValidationResponse(false, false, false, false,
                    "doctorId, facilityId y scheduledDate son obligatorios"));
        }

        if (request.scheduledDate().isBefore(LocalDateTime.now())) {
            return Uni.createFrom().item(new AppointmentValidationResponse(false, true, false, false,
                    "No se puede agendar una cita en fecha pasada"));
        }

        return Doctor.<Doctor>findById(request.doctorId())
                .onItem().transformToUni(doctor -> {
                    if (doctor == null) {
                        return Uni.createFrom().item(new AppointmentValidationResponse(false, false, false, false,
                                "El medico no existe"));
                    }

                    var doctorAssignedToFacility = doctor.facilities.stream()
                            .anyMatch(facility -> facility.id.equals(request.facilityId()));

                    if (!doctorAssignedToFacility) {
                        return Uni.createFrom().item(new AppointmentValidationResponse(false, false, true, false,
                                "El medico no atiende en la sede seleccionada"));
                    }

                    Uni<Long> conflicts = request.appointmentId() == null
                            ? Appointment.count(
                                    "doctor.id = ?1 and scheduledDate = ?2 and status <> ?3",
                                    request.doctorId(), request.scheduledDate(), AppointmentStatus.canceled)
                            : Appointment.count(
                                    "doctor.id = ?1 and scheduledDate = ?2 and status <> ?3 and id <> ?4",
                                    request.doctorId(), request.scheduledDate(), AppointmentStatus.canceled,
                                    request.appointmentId());

                    return conflicts.onItem().transform(conflictCount -> {
                        if (conflictCount > 0) {
                            return new AppointmentValidationResponse(false, false, true, true,
                                    "El medico ya tiene una cita en la fecha y hora indicada");
                        }

                        return new AppointmentValidationResponse(true, false, true, false, "Horario disponible");
                    });
                });
    }

    public record AppointmentValidationRequest(
            UUID doctorId,
            UUID facilityId,
            LocalDateTime scheduledDate,
            UUID appointmentId) {
    }

    public record AppointmentValidationResponse(
            boolean valid,
            boolean dateInPast,
            boolean doctorAssignedToFacility,
            boolean hasConflict,
            String message) {
    }
}
