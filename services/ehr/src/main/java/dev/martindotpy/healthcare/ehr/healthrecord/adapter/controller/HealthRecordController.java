package dev.martindotpy.healthcare.ehr.healthrecord.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.ehr.HealthRecord;
import io.quarkus.hibernate.reactive.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@Tag(name = "Health Record")
@ResourceProperties(path = "/api/health-record", authenticated = true)
public interface HealthRecordController extends PanacheEntityResource<HealthRecord, UUID> {

}
