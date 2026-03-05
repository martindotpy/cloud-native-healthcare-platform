package dev.martindotpy.healthcare.ehr.prescription.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.ehr.Prescription;
import io.quarkus.hibernate.reactive.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@Tag(name = "Prescription")
@ResourceProperties(path = "/api/prescription", authenticated = true)
public interface PrescriptionController extends PanacheEntityResource<Prescription, UUID> {

}
