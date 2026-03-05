package dev.martindotpy.healthcare.insurance.invoince.adapter.controller;

import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import dev.martindotpy.healthcare.shared.domain.model.insurance.Invoice;
import io.quarkus.hibernate.reactive.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

@Tag(name = "Invoice")
@ResourceProperties(path = "/api/insurance/invoice", authenticated = true)
public interface InvoiceController extends PanacheEntityResource<Invoice, UUID> {

}
