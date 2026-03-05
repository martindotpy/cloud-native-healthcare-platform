package dev.martindotpy.healthcare.insurance.invoince.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.insurance.invoince.application.usecase.GetInvoiceSummaryUseCase;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/insurance/invoice")
@Tag(name = "Invoice")
@Authenticated
@Produces(MediaType.APPLICATION_JSON)
public class InvoiceSummaryController {

    @Inject
    GetInvoiceSummaryUseCase getInvoiceSummaryUseCase;

    @GET
    @Path("/summary/{invoiceId}")
    @Operation(summary = "Get invoice summary")
    @APIResponse(responseCode = "200", description = "Invoice summary", content = @Content(schema = @Schema(implementation = InvoiceSummaryResponse.class)))
    public Uni<InvoiceSummaryResponse> getSummary(@PathParam("invoiceId") UUID invoiceId) {
        return getInvoiceSummaryUseCase.getById(invoiceId)
                .onItem().transform(result -> new InvoiceSummaryResponse(
                        result.found(),
                        result.message(),
                        result.invoiceId(),
                        result.appointmentId(),
                        result.insuranceProviderId(),
                        result.insuranceProviderName(),
                        result.totalAmount(),
                        result.paymentMethod(),
                        result.issuedAt()));
    }

    public record InvoiceSummaryResponse(
            boolean found,
            String message,
            UUID invoiceId,
            UUID appointmentId,
            UUID insuranceProviderId,
            String insuranceProviderName,
            java.math.BigDecimal totalAmount,
            String paymentMethod,
            java.time.LocalDateTime issuedAt) {
    }
}
