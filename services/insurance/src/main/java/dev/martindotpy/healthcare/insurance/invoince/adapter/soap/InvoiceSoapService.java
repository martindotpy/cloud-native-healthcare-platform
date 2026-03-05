package dev.martindotpy.healthcare.insurance.invoince.adapter.soap;

import java.util.UUID;

import dev.martindotpy.healthcare.insurance.invoince.application.usecase.GetInvoiceSummaryUseCase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.jws.WebService;
import lombok.RequiredArgsConstructor;

@ApplicationScoped
@WebService(endpointInterface = "dev.martindotpy.healthcare.insurance.invoince.adapter.soap.InvoiceSoapEndpoint", serviceName = "InvoiceSoapService", portName = "InvoiceSoapPort", targetNamespace = "http://martindotpy.dev/healthcare/insurance/invoice")
@RequiredArgsConstructor
public class InvoiceSoapService implements InvoiceSoapEndpoint {

    private final GetInvoiceSummaryUseCase getInvoiceSummaryUseCase;

    @Override
    public InvoiceSoapResponse getInvoiceById(String invoiceId) {
        var response = new InvoiceSoapResponse();

        UUID parsedId;
        try {
            parsedId = UUID.fromString(invoiceId);
        } catch (Exception exception) {
            response.found = false;
            response.message = "invoiceId invalido";
            return response;
        }

        var result = getInvoiceSummaryUseCase.getById(parsedId).await().indefinitely();

        response.found = result.found();
        response.message = result.message();
        response.invoiceId = result.invoiceId() == null ? null : result.invoiceId().toString();
        response.appointmentId = result.appointmentId() == null ? null : result.appointmentId().toString();
        response.insuranceProviderId = result.insuranceProviderId() == null ? null
                : result.insuranceProviderId().toString();
        response.insuranceProviderName = result.insuranceProviderName();
        response.totalAmount = result.totalAmount();
        response.paymentMethod = result.paymentMethod();
        response.issuedAt = result.issuedAt() == null ? null : result.issuedAt().toString();

        return response;
    }
}
