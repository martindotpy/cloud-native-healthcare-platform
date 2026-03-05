package dev.martindotpy.healthcare.appointment.core.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.appointment.Appointment;
import dev.martindotpy.healthcare.shared.domain.model.ehr.ClinicalEpisode;
import dev.martindotpy.healthcare.shared.domain.model.insurance.Invoice;
import io.quarkus.hibernate.reactive.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@Tag(name = "Appointment")
@ResourceProperties(path = "/api/appointment", authenticated = true)
public interface AppointmentController extends PanacheEntityResource<Appointment, UUID> {

    @Override
    default Uni<Boolean> delete(UUID id) {
        var invoiceCountUni = Invoice.count("appointment.id = ?1", id);
        var episodeCountUni = ClinicalEpisode.count("appointment.id = ?1", id);

        return Uni.combine().all().unis(invoiceCountUni, episodeCountUni).asTuple()
                .onItem().transformToUni(tuple -> {
                    var hasRelatedInvoice = tuple.getItem1() > 0;
                    var hasRelatedEpisode = tuple.getItem2() > 0;

                    if (hasRelatedInvoice || hasRelatedEpisode) {
                        var message = "No se puede eliminar la cita porque tiene informacion clinica o financiera asociada";
                        var conflict = Response.status(Response.Status.CONFLICT)
                                .entity(message)
                                .build();

                        return Uni.createFrom().failure(new WebApplicationException(message, conflict));
                    }

                    return PanacheEntityResource.super.delete(id);
                });
    }

}
