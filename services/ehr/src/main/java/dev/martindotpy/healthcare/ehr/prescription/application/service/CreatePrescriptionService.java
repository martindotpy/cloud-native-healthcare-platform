package dev.martindotpy.healthcare.ehr.prescription.application.service;

import java.util.UUID;

import dev.martindotpy.healthcare.ehr.prescription.application.usecase.CreatePrescriptionCommand;
import dev.martindotpy.healthcare.ehr.prescription.application.usecase.CreatePrescriptionResult;
import dev.martindotpy.healthcare.ehr.prescription.application.usecase.CreatePrescriptionUseCase;
import dev.martindotpy.healthcare.shared.domain.model.ehr.ClinicalEpisode;
import dev.martindotpy.healthcare.shared.domain.model.ehr.Prescription;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CreatePrescriptionService implements CreatePrescriptionUseCase {

    @Override
    public Uni<CreatePrescriptionResult> create(CreatePrescriptionCommand command) {
        if (command == null || command.clinicalEpisodeId() == null || command.medicationDetails() == null
                || command.medicationDetails().isBlank() || command.instructions() == null
                || command.instructions().isBlank()) {
            return Uni.createFrom().item(new CreatePrescriptionResult(false,
                    "clinicalEpisodeId, medicationDetails e instructions son obligatorios", null));
        }

        return Panache.withTransaction(() -> ClinicalEpisode.<ClinicalEpisode>findById(command.clinicalEpisodeId())
                .onItem().transformToUni(episode -> {
                    if (episode == null) {
                        return Uni.createFrom().item(new CreatePrescriptionResult(false,
                                "El episodio clinico no existe", null));
                    }

                    var prescription = new Prescription();
                    prescription.id = UUID.randomUUID();
                    prescription.clinicalEpisode = episode;
                    prescription.medicationDetails = command.medicationDetails();
                    prescription.instructions = command.instructions();

                    return prescription.persist()
                            .replaceWith(new CreatePrescriptionResult(
                                    true,
                                    "Receta creada correctamente",
                                    prescription.id));
                }));
    }
}
