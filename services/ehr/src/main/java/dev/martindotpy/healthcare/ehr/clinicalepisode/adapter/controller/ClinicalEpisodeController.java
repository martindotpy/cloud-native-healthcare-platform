package dev.martindotpy.healthcare.ehr.clinicalepisode.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.ehr.ClinicalEpisode;
import io.quarkus.hibernate.reactive.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@Tag(name = "Clinical Episode")
@ResourceProperties(path = "/api/clinical-episode", authenticated = true)
public interface ClinicalEpisodeController extends PanacheEntityResource<ClinicalEpisode, UUID> {

}
