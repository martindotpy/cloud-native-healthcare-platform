package dev.martindotpy.healthcare.appointment.doctor.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.appointment.Doctor;
import io.quarkus.hibernate.reactive.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@Tag(name = "Doctor")
@ResourceProperties(path = "/api/doctor", authenticated = true)
public interface DoctorController extends PanacheEntityResource<Doctor, UUID> {

}
