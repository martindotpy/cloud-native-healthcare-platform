package dev.martindotpy.healthcare.appointment.core.integration.insurance.soap;

import java.math.BigDecimal;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "InvoiceSoapResponse")
public class InsuranceInvoiceSoapResponse {
    public boolean found;
    public String message;
    public String invoiceId;
    public String appointmentId;
    public String insuranceProviderId;
    public String insuranceProviderName;
    public BigDecimal totalAmount;
    public String paymentMethod;
    public String issuedAt;
}
