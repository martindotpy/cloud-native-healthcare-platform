package dev.martindotpy.healthcare.appointment.core.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.appointment.Appointment;
import io.quarkus.hibernate.reactive.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@Tag(name = "Appointment")
@ResourceProperties(path = "/api/appointment", authenticated = true)
public interface AppointmentController extends PanacheEntityResource<Appointment, UUID> {

}
