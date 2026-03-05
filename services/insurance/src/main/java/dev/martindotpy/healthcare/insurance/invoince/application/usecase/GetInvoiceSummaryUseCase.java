package dev.martindotpy.healthcare.insurance.invoince.application.usecase;

import java.util.UUID;

import io.smallrye.mutiny.Uni;

public interface GetInvoiceSummaryUseCase {
    Uni<InvoiceSummaryResult> getById(UUID invoiceId);
}
