package dev.martindotpy.healthcare.ehr.clinicalepisode.application.usecase;

import java.util.UUID;

public record CreateClinicalEpisodeResult(
        boolean success,
        String message,
        UUID clinicalEpisodeId) {
}
