package dev.martindotpy.healthcare.ehr.prescription.application.usecase;

import io.smallrye.mutiny.Uni;

public interface CreatePrescriptionUseCase {
    Uni<CreatePrescriptionResult> create(CreatePrescriptionCommand command);
}
