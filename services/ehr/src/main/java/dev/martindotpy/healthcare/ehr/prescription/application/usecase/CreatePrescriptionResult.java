package dev.martindotpy.healthcare.ehr.prescription.application.usecase;

import java.util.UUID;

public record CreatePrescriptionResult(
        boolean success,
        String message,
        UUID prescriptionId) {
}
