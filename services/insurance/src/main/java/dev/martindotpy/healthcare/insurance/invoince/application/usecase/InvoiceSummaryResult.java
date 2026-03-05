package dev.martindotpy.healthcare.insurance.invoince.application.usecase;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record InvoiceSummaryResult(
        boolean found,
        String message,
        UUID invoiceId,
        UUID appointmentId,
        UUID insuranceProviderId,
        String insuranceProviderName,
        BigDecimal totalAmount,
        String paymentMethod,
        LocalDateTime issuedAt) {

    public static InvoiceSummaryResult notFound(String message) {
        return new InvoiceSummaryResult(false, message, null, null, null, null, null, null, null);
    }
}
