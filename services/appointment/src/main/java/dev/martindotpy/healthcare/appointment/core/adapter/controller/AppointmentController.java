package dev.martindotpy.healthcare.appointment.core.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.appointment.core.application.usecase.DeleteAppointmentUseCase;
import dev.martindotpy.healthcare.shared.domain.model.appointment.Appointment;
import io.quarkus.arc.Arc;
import io.quarkus.hibernate.reactive.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;
import io.smallrye.mutiny.Uni;

@Tag(name = "Appointment")
@ResourceProperties(path = "/api/appointment", authenticated = true)
public interface AppointmentController extends PanacheEntityResource<Appointment, UUID> {

    @Override
    default Uni<Boolean> delete(UUID id) {
        var deleteAppointmentUseCase = Arc.container().instance(DeleteAppointmentUseCase.class).get();
        return deleteAppointmentUseCase.delete(id);
    }

}
