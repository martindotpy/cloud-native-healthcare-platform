package dev.martindotpy.healthcare.insurance.core.adapter.exception;

import org.hibernate.exception.ConstraintViolationException;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class InsuranceConstraintViolationMapper implements ExceptionMapper<ConstraintViolationException> {

    @Override
    public Response toResponse(ConstraintViolationException exception) {
        String constraintName = exception.getConstraintName();

        if ("invoice_appointmentId_unique".equals(constraintName)) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("La cita seleccionada ya tiene una factura registrada")
                    .build();
        }

        return Response.status(Response.Status.BAD_REQUEST)
                .entity("No se pudo completar la operacion por restriccion de datos")
                .build();
    }
}
