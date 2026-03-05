package dev.martindotpy.healthcare.appointment.doctor.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.appointment.doctor.application.usecase.AssignDoctorFacilityUseCase;
import dev.martindotpy.healthcare.appointment.doctor.application.usecase.AssignDoctorSpecialtyUseCase;
import dev.martindotpy.healthcare.appointment.doctor.application.usecase.DoctorAssignmentResult;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/doctor")
@Tag(name = "Doctor")
@Authenticated
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class DoctorAssignmentController {

    @Inject
    AssignDoctorSpecialtyUseCase assignDoctorSpecialtyUseCase;

    @Inject
    AssignDoctorFacilityUseCase assignDoctorFacilityUseCase;

    @POST
    @Path("/{doctorId}/specialty/{specialtyId}")
    @Operation(summary = "Assign a specialty to a doctor")
    @APIResponse(responseCode = "200", description = "Assignment result", content = @Content(schema = @Schema(implementation = DoctorAssignmentResponse.class)))
    public Uni<DoctorAssignmentResponse> assignSpecialty(
            @PathParam("doctorId") UUID doctorId,
            @PathParam("specialtyId") UUID specialtyId) {
        return assignDoctorSpecialtyUseCase.assign(doctorId, specialtyId)
                .onItem().transform(this::toResponse);
    }

    @POST
    @Path("/{doctorId}/facility/{facilityId}")
    @Operation(summary = "Assign a facility to a doctor")
    @APIResponse(responseCode = "200", description = "Assignment result", content = @Content(schema = @Schema(implementation = DoctorAssignmentResponse.class)))
    public Uni<DoctorAssignmentResponse> assignFacility(
            @PathParam("doctorId") UUID doctorId,
            @PathParam("facilityId") UUID facilityId) {
        return assignDoctorFacilityUseCase.assign(doctorId, facilityId)
                .onItem().transform(this::toResponse);
    }

    private DoctorAssignmentResponse toResponse(DoctorAssignmentResult result) {
        return new DoctorAssignmentResponse(result.success(), result.message());
    }

    public record DoctorAssignmentResponse(boolean success, String message) {
    }
}
