package dev.martindotpy.healthcare.insurance.invoince.application.service;

import java.util.UUID;

import dev.martindotpy.healthcare.insurance.invoince.application.usecase.GetInvoiceSummaryUseCase;
import dev.martindotpy.healthcare.insurance.invoince.application.usecase.InvoiceSummaryResult;
import dev.martindotpy.healthcare.shared.domain.model.insurance.Invoice;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class GetInvoiceSummaryService implements GetInvoiceSummaryUseCase {

    @Override
    @WithSession
    public Uni<InvoiceSummaryResult> getById(UUID invoiceId) {
        if (invoiceId == null) {
            return Uni.createFrom().item(InvoiceSummaryResult.notFound("invoiceId es obligatorio"));
        }

        return Invoice.<Invoice>findById(invoiceId)
                .onItem().transform(invoice -> {
                    if (invoice == null) {
                        return InvoiceSummaryResult.notFound("No existe la factura");
                    }

                    var provider = invoice.insuranceProvider;
                    var providerId = provider == null ? null : provider.id;
                    var providerName = provider == null ? null : provider.name;
                    var appointment = invoice.appointment;
                    var appointmentId = appointment == null ? null : appointment.id;

                    return new InvoiceSummaryResult(
                            true,
                            "Factura encontrada",
                            invoice.id,
                            appointmentId,
                            providerId,
                            providerName,
                            invoice.totalAmount,
                            invoice.paymentMethod,
                            invoice.issuedAt);
                });
    }
}
