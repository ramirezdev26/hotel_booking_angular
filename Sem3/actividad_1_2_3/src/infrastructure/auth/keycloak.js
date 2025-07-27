import KeycloakConnect from "keycloak-connect";

const keycloak = new KeycloakConnect(
    {},
    {
        "realm": "hotel-booking",
        "auth-server-url": "http://localhost:8080/",
        "ssl-required": "external",
        "resource": "public-client",
        "public-client": true,
        "confidential-port": 0
    }
);

export default keycloak;