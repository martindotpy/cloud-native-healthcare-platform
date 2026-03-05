package dev.martindotpy.healthcare.insurance.provider.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.insurance.InsuranceProvider;
import io.quarkus.hibernate.reactive.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@Tag(name = "Insurance Provider")
@ResourceProperties(path = "/api/insurance/provider", authenticated = true)
public interface InsuranceProviderController extends PanacheEntityResource<InsuranceProvider, UUID> {

}
