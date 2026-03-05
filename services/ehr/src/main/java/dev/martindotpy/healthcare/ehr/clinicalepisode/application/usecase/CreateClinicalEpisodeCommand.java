package dev.martindotpy.healthcare.ehr.clinicalepisode.application.usecase;

import java.util.UUID;

public record CreateClinicalEpisodeCommand(
        UUID healthRecordId,
        UUID appointmentId,
        String diagnosis,
        String treatmentPlan) {
}
