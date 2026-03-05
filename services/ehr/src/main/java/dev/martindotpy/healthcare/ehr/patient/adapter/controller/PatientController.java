package dev.martindotpy.healthcare.ehr.patient.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.ehr.Patient;
import io.quarkus.hibernate.reactive.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@Tag(name = "Patient")
@ResourceProperties(path = "/api/patient", authenticated = true)
public interface PatientController extends PanacheEntityResource<Patient, UUID> {

}
