package dev.martindotpy.healthcare.ehr.core.adapter.controller;

import org.eclipse.microprofile.openapi.annotations.extensions.Extension;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/")
@Extension(name = "x-smallrye-profile-internal", value = "")
public class MiscellaneousController {
    @GET
    @Path("/_health")
    public String hello() {
        return "Ok";
    }
}
