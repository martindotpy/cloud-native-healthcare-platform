package dev.martindotpy.healthcare.insurance.core.adapter.controller;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class MiscellaneousControllerTest {
    @Test
    void testHelloEndpoint() {
        given()
                .when().get("/_health")
                .then()
                .statusCode(200)
                .body(is("Ok"));
    }
}
