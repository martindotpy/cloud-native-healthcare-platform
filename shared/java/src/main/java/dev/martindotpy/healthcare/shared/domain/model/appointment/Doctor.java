package dev.martindotpy.healthcare.shared.domain.model.appointment;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = "medical_license")
})
public class Doctor extends PanacheEntityBase {
    @Id
    @NotNull
    public UUID id;

    @NotBlank
    @Column(length = 20)
    public String medicalLicense;
    @NotBlank
    @Column(length = 100)
    public String firstName;
    @NotBlank
    @Column(length = 100)
    public String lastName;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "doctor_specialty", joinColumns = @JoinColumn(name = "doctor_id"), inverseJoinColumns = @JoinColumn(name = "specialty_id"))
    public Set<Specialty> specialties = new HashSet<>();
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "doctor_facility", joinColumns = @JoinColumn(name = "doctor_id"), inverseJoinColumns = @JoinColumn(name = "facility_id"))
    public Set<Facility> facilities = new HashSet<>();
}
