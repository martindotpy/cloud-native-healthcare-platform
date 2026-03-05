package dev.martindotpy.healthcare.ehr.clinicalepisode.application.usecase;

import io.smallrye.mutiny.Uni;

public interface CreateClinicalEpisodeUseCase {
    Uni<CreateClinicalEpisodeResult> create(CreateClinicalEpisodeCommand command);
}
