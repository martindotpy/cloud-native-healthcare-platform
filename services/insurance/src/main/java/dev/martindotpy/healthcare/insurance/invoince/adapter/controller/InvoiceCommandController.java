package dev.martindotpy.healthcare.insurance.invoince.adapter.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.appointment.Appointment;
import dev.martindotpy.healthcare.shared.domain.model.insurance.InsuranceProvider;
import dev.martindotpy.healthcare.shared.domain.model.insurance.Invoice;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/insurance/invoice")
@Tag(name = "Invoice")
@Authenticated
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class InvoiceCommandController {

    @GET
    @Path("/available-appointments")
    @WithSession
    @Operation(summary = "List appointments available for invoice creation")
    @APIResponse(responseCode = "200", description = "Appointments without invoices", content = @Content(schema = @Schema(implementation = Appointment.class)))
    public Uni<List<Appointment>> getAvailableAppointments() {
        return Appointment.<Appointment>find(
                "select a from Appointment a " +
                        "where not exists (" +
                        "select 1 from Invoice i where i.appointment.id = a.id" +
                        ") order by a.scheduledDate desc")
                .list();
    }

    @POST
    @Path("/create-by-ids")
    @WithTransaction
    @Operation(summary = "Create invoice using entity IDs")
    @APIResponse(responseCode = "201", description = "Invoice created", content = @Content(schema = @Schema(implementation = Invoice.class)))
    @APIResponse(responseCode = "404", description = "Appointment or insurance provider was not found")
    @APIResponse(responseCode = "409", description = "The appointment already has a registered invoice")
    public Uni<Response> createByIds(@Valid CreateInvoiceByIdsRequest request) {
        return Appointment.<Appointment>findById(request.appointmentId())
                .onItem().ifNull().failWith(() -> notFound("No existe la cita seleccionada"))
                .onItem().transformToUni(appointment -> resolveProvider(request.insuranceProviderId())
                        .onItem().transformToUni(provider -> Invoice.count("appointment.id = ?1", appointment.id)
                                .onItem().transformToUni(existing -> {
                                    if (existing > 0) {
                                        return Uni.createFrom().failure(conflict(
                                                "La cita seleccionada ya tiene una factura registrada"));
                                    }

                                    Invoice invoice = new Invoice();
                                    invoice.id = request.id() == null ? UUID.randomUUID() : request.id();
                                    invoice.appointment = appointment;
                                    invoice.insuranceProvider = provider;
                                    invoice.totalAmount = request.totalAmount();
                                    invoice.paymentMethod = request.paymentMethod().trim();

                                    return invoice.<Invoice>persist().replaceWith(invoice);
                                })))
                .onItem().transform(invoice -> Response.status(Response.Status.CREATED).entity(invoice).build());
    }

    private Uni<InsuranceProvider> resolveProvider(UUID insuranceProviderId) {
        if (insuranceProviderId == null) {
            return Uni.createFrom().nullItem();
        }

        return InsuranceProvider.<InsuranceProvider>findById(insuranceProviderId)
                .onItem().ifNull().failWith(() -> notFound("No existe la aseguradora seleccionada"));
    }

    private WebApplicationException notFound(String message) {
        return webException(Response.Status.NOT_FOUND, message);
    }

    private WebApplicationException conflict(String message) {
        return webException(Response.Status.CONFLICT, message);
    }

    private WebApplicationException webException(Response.Status status, String message) {
        Response response = Response.status(status).entity(message).build();
        return new WebApplicationException(message, response);
    }

    public record CreateInvoiceByIdsRequest(
            UUID id,
            @NotNull UUID appointmentId,
            UUID insuranceProviderId,
            @NotNull @DecimalMin("0.01") BigDecimal totalAmount,
            @NotBlank String paymentMethod) {
    }
}
