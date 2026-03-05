package dev.martindotpy.healthcare.insurance.invoince.adapter.soap;

import jakarta.jws.WebMethod;
import jakarta.jws.WebService;

@WebService(name = "InvoiceSoapEndpoint", targetNamespace = "http://martindotpy.dev/healthcare/insurance/invoice")
public interface InvoiceSoapEndpoint {

    @WebMethod
    InvoiceSoapResponse getInvoiceById(String invoiceId);
}
