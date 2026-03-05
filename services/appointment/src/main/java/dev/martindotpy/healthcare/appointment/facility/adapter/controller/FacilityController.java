package dev.martindotpy.healthcare.appointment.facility.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.appointment.Facility;
import io.quarkus.hibernate.reactive.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@Tag(name = "Facility")
@ResourceProperties(path = "/api/facility", authenticated = true)
public interface FacilityController extends PanacheEntityResource<Facility, UUID> {

}
