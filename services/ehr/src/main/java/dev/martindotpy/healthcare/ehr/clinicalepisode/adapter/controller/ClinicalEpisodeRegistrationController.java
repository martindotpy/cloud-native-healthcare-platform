package dev.martindotpy.healthcare.ehr.clinicalepisode.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.ehr.clinicalepisode.application.usecase.CreateClinicalEpisodeCommand;
import dev.martindotpy.healthcare.ehr.clinicalepisode.application.usecase.CreateClinicalEpisodeUseCase;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/clinical-episode")
@Tag(name = "Clinical Episode")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ClinicalEpisodeRegistrationController {

    @Inject
    CreateClinicalEpisodeUseCase createClinicalEpisodeUseCase;

    @POST
    @Path("/register")
    @Operation(summary = "Register a clinical episode")
    @APIResponse(responseCode = "200", description = "Clinical episode registration result", content = @Content(schema = @Schema(implementation = CreateClinicalEpisodeResponse.class)))
    public Uni<CreateClinicalEpisodeResponse> register(CreateClinicalEpisodeRequest request) {
        var command = new CreateClinicalEpisodeCommand(
                request == null ? null : request.healthRecordId(),
                request == null ? null : request.appointmentId(),
                request == null ? null : request.diagnosis(),
                request == null ? null : request.treatmentPlan());

        return createClinicalEpisodeUseCase.create(command)
                .onItem().transform(result -> new CreateClinicalEpisodeResponse(
                        result.success(),
                        result.message(),
                        result.clinicalEpisodeId()));
    }

    public record CreateClinicalEpisodeRequest(
            UUID healthRecordId,
            UUID appointmentId,
            String diagnosis,
            String treatmentPlan) {
    }

    public record CreateClinicalEpisodeResponse(
            boolean success,
            String message,
            UUID clinicalEpisodeId) {
    }
}
