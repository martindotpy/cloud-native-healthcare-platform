package dev.martindotpy.healthcare.appointment.core.adapter.controller;

import java.time.LocalDateTime;
import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.appointment.core.application.usecase.AppointmentValidationCommand;
import dev.martindotpy.healthcare.appointment.core.application.usecase.ValidateAppointmentUseCase;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import lombok.RequiredArgsConstructor;

@Path("/api/appointment")
@Tag(name = "Appointment")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class AppointmentValidationController {

    private final ValidateAppointmentUseCase validateAppointmentUseCase;

    @POST
    @Path("/validate")
    @Operation(summary = "Validate appointment scheduling rules")
    @APIResponse(responseCode = "200", description = "Validation result", content = @Content(schema = @Schema(implementation = AppointmentValidationResponse.class)))
    public Uni<AppointmentValidationResponse> validate(AppointmentValidationRequest request) {
        var command = new AppointmentValidationCommand(
                request == null ? null : request.doctorId(),
                request == null ? null : request.facilityId(),
                request == null ? null : request.scheduledDate(),
                request == null ? null : request.appointmentId());

        return validateAppointmentUseCase.validate(command)
                .onItem().transform(result -> new AppointmentValidationResponse(
                        result.valid(),
                        result.dateInPast(),
                        result.doctorAssignedToFacility(),
                        result.hasConflict(),
                        result.message()));
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
