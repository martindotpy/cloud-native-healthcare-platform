package dev.martindotpy.healthcare.insurance.invoince.adapter.controller;

import java.time.LocalDateTime;
import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.insurance.invoince.adapter.soap.InvoiceSoapEndpoint;
import dev.martindotpy.healthcare.insurance.invoince.adapter.soap.InvoiceSoapResponse;
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
    InvoiceSoapEndpoint invoiceSoapEndpoint;

    @GET
    @Path("/summary/{invoiceId}")
    @Operation(summary = "Get invoice summary")
    @APIResponse(responseCode = "200", description = "Invoice summary", content = @Content(schema = @Schema(implementation = InvoiceSummaryResponse.class)))
    public Uni<InvoiceSummaryResponse> getSummary(@PathParam("invoiceId") UUID invoiceId) {
        return Uni.createFrom().item(() -> {
            InvoiceSoapResponse result = invoiceSoapEndpoint.getInvoiceById(invoiceId.toString());

            String message = result.message == null ? "Resultado SOAP" : result.message;
            String messageWithSource = message + " (via SOAP)";

            return new InvoiceSummaryResponse(
                    result.found,
                    messageWithSource,
                    parseUuid(result.invoiceId),
                    parseUuid(result.appointmentId),
                    parseUuid(result.insuranceProviderId),
                    result.insuranceProviderName,
                    result.totalAmount,
                    result.paymentMethod,
                    parseLocalDateTime(result.issuedAt));
        });
    }

    private UUID parseUuid(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return UUID.fromString(value);
    }

    private LocalDateTime parseLocalDateTime(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return LocalDateTime.parse(value);
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
