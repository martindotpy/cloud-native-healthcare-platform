package dev.martindotpy.healthcare.ehr.prescription.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.ehr.prescription.application.usecase.CreatePrescriptionCommand;
import dev.martindotpy.healthcare.ehr.prescription.application.usecase.CreatePrescriptionUseCase;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/prescription")
@Tag(name = "Prescription")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PrescriptionRegistrationController {

    @Inject
    CreatePrescriptionUseCase createPrescriptionUseCase;

    @POST
    @Path("/register")
    @Operation(summary = "Register a prescription")
    @APIResponse(responseCode = "200", description = "Prescription registration result", content = @Content(schema = @Schema(implementation = CreatePrescriptionResponse.class)))
    public Uni<CreatePrescriptionResponse> register(CreatePrescriptionRequest request) {
        var command = new CreatePrescriptionCommand(
                request == null ? null : request.clinicalEpisodeId(),
                request == null ? null : request.medicationDetails(),
                request == null ? null : request.instructions());

        return createPrescriptionUseCase.create(command)
                .onItem().transform(result -> new CreatePrescriptionResponse(
                        result.success(),
                        result.message(),
                        result.prescriptionId()));
    }

    public record CreatePrescriptionRequest(
            UUID clinicalEpisodeId,
            String medicationDetails,
            String instructions) {
    }

    public record CreatePrescriptionResponse(
            boolean success,
            String message,
            UUID prescriptionId) {
    }
}
