package dev.martindotpy.healthcare.ehr.clinicalepisode.application.service;

import java.util.UUID;

import dev.martindotpy.healthcare.ehr.clinicalepisode.application.usecase.CreateClinicalEpisodeCommand;
import dev.martindotpy.healthcare.ehr.clinicalepisode.application.usecase.CreateClinicalEpisodeResult;
import dev.martindotpy.healthcare.ehr.clinicalepisode.application.usecase.CreateClinicalEpisodeUseCase;
import dev.martindotpy.healthcare.shared.domain.model.appointment.Appointment;
import dev.martindotpy.healthcare.shared.domain.model.ehr.ClinicalEpisode;
import dev.martindotpy.healthcare.shared.domain.model.ehr.HealthRecord;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CreateClinicalEpisodeService implements CreateClinicalEpisodeUseCase {

    @Override
    public Uni<CreateClinicalEpisodeResult> create(CreateClinicalEpisodeCommand command) {
        if (command == null || command.healthRecordId() == null || command.appointmentId() == null
                || command.diagnosis() == null || command.diagnosis().isBlank()) {
            return Uni.createFrom().item(new CreateClinicalEpisodeResult(false,
                    "healthRecordId, appointmentId y diagnosis son obligatorios", null));
        }

        return Panache.withTransaction(() -> HealthRecord.<HealthRecord>findById(command.healthRecordId())
                .onItem().transformToUni(healthRecord -> {
                    if (healthRecord == null) {
                        return Uni.createFrom().item(new CreateClinicalEpisodeResult(false,
                                "La historia clinica no existe", null));
                    }

                    return Appointment.<Appointment>findById(command.appointmentId())
                            .onItem().transformToUni(appointment -> {
                                if (appointment == null) {
                                    return Uni.createFrom().item(new CreateClinicalEpisodeResult(false,
                                            "La cita no existe", null));
                                }

                                return ClinicalEpisode.count("appointment.id = ?1", command.appointmentId())
                                        .onItem().transformToUni(existing -> {
                                            if (existing > 0) {
                                                return Uni.createFrom().item(new CreateClinicalEpisodeResult(false,
                                                        "La cita ya tiene un episodio clinico", null));
                                            }

                                            var episode = new ClinicalEpisode();
                                            episode.id = UUID.randomUUID();
                                            episode.healthRecord = healthRecord;
                                            episode.appointment = appointment;
                                            episode.diagnosis = command.diagnosis();
                                            episode.treatmentPlan = command.treatmentPlan();

                                            return episode.persist()
                                                    .replaceWith(new CreateClinicalEpisodeResult(
                                                            true,
                                                            "Episodio clinico creado correctamente",
                                                            episode.id));
                                        });
                            });
                }));
    }
}
