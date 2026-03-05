package dev.martindotpy.healthcare.ehr.prescription.application.usecase;

import java.util.UUID;

public record CreatePrescriptionCommand(
        UUID clinicalEpisodeId,
        String medicationDetails,
        String instructions) {
}
