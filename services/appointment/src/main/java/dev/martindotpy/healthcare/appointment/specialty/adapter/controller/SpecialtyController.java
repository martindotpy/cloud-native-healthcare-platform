package dev.martindotpy.healthcare.appointment.specialty.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.appointment.Specialty;
import io.quarkus.hibernate.reactive.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@Tag(name = "Specialty")
@ResourceProperties(path = "/api/specialty", authenticated = true)
public interface SpecialtyController extends PanacheEntityResource<Specialty, UUID> {

}
