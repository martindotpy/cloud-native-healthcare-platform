package dev.martindotpy.healthcare.appointment.core.integration.insurance.soap;

import jakarta.jws.WebMethod;
import jakarta.jws.WebService;

@WebService(name = "InvoiceSoapEndpoint", targetNamespace = "http://martindotpy.dev/healthcare/insurance/invoice")
public interface InsuranceInvoiceSoapClient {

    @WebMethod
    InsuranceInvoiceSoapResponse getInvoiceById(String invoiceId);
}
