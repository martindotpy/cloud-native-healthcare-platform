package dev.martindotpy.healthcare.appointment.core.application.service;

import java.util.UUID;

import dev.martindotpy.healthcare.appointment.core.application.usecase.DeleteAppointmentUseCase;
import dev.martindotpy.healthcare.shared.domain.model.appointment.Appointment;
import dev.martindotpy.healthcare.shared.domain.model.ehr.ClinicalEpisode;
import dev.martindotpy.healthcare.shared.domain.model.insurance.Invoice;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class DeleteAppointmentService implements DeleteAppointmentUseCase {

    @Override
    @WithTransaction
    public Uni<Boolean> delete(UUID appointmentId) {
        var invoiceCountUni = Invoice.count("appointment.id = ?1", appointmentId);
        var episodeCountUni = ClinicalEpisode.count("appointment.id = ?1", appointmentId);

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

                    return Appointment.deleteById(appointmentId);
                });
    }
}
