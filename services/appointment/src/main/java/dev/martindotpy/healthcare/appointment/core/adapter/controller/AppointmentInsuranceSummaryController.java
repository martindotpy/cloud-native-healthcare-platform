package dev.martindotpy.healthcare.appointment.core.adapter.controller;

import java.time.LocalDateTime;
import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.appointment.core.integration.insurance.soap.InsuranceInvoiceSoapClient;
import dev.martindotpy.healthcare.appointment.core.integration.insurance.soap.InsuranceInvoiceSoapResponse;
import dev.martindotpy.healthcare.shared.domain.model.insurance.Invoice;
import io.quarkiverse.cxf.annotation.CXFClient;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.security.Authenticated;
import io.smallrye.common.annotation.Blocking;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/appointment/insurance-summary")
@Tag(name = "Appointment")
@Authenticated
@Produces(MediaType.APPLICATION_JSON)
public class AppointmentInsuranceSummaryController {

    @Inject
    @CXFClient("insurance-invoice-soap")
    InsuranceInvoiceSoapClient insuranceInvoiceSoapClient;

    @GET
    @Path("/by-appointment/{appointmentId}")
    @Blocking
    @WithSession
    @Operation(summary = "Get insurance summary for an appointment through SOAP client")
    @APIResponse(responseCode = "200", description = "Insurance summary through SOAP", content = @Content(schema = @Schema(implementation = AppointmentInsuranceSummaryResponse.class)))
    public Uni<AppointmentInsuranceSummaryResponse> getByAppointmentId(@PathParam("appointmentId") UUID appointmentId) {
        return Invoice.<Invoice>find("appointment.id", appointmentId)
                .firstResult()
                .onItem().transform(invoice -> {
                    if (invoice == null) {
                        return AppointmentInsuranceSummaryResponse.notFound(
                                "No existe factura asociada a la cita");
                    }

                    InsuranceInvoiceSoapResponse soapResponse = insuranceInvoiceSoapClient
                            .getInvoiceById(invoice.id.toString());
                    String baseMessage = soapResponse.message == null ? "Resultado SOAP" : soapResponse.message;

                    return new AppointmentInsuranceSummaryResponse(
                            soapResponse.found,
                            baseMessage + " (SOAP client: appointment -> insurance)",
                            parseUuid(soapResponse.invoiceId),
                            parseUuid(soapResponse.appointmentId),
                            parseUuid(soapResponse.insuranceProviderId),
                            soapResponse.insuranceProviderName,
                            soapResponse.totalAmount,
                            soapResponse.paymentMethod,
                            parseLocalDateTime(soapResponse.issuedAt));
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

    public record AppointmentInsuranceSummaryResponse(
            boolean found,
            String message,
            UUID invoiceId,
            UUID appointmentId,
            UUID insuranceProviderId,
            String insuranceProviderName,
            java.math.BigDecimal totalAmount,
            String paymentMethod,
            java.time.LocalDateTime issuedAt) {

        static AppointmentInsuranceSummaryResponse notFound(String message) {
            return new AppointmentInsuranceSummaryResponse(false, message, null, null, null, null, null, null, null);
        }
    }
}
