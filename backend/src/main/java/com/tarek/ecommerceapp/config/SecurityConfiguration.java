// Package declaration
package com.tarek.ecommerceapp.config;

// Import statements
import com.okta.spring.boot.oauth.Okta;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;
import org.springframework.web.cors.CorsConfiguration;

// @Configuration annotation indicates that this class is a configuration class
@Configuration
public class SecurityConfiguration {
    // Injecting the Okta issuer URI from application properties
    @Value("${okta.oauth2.issuer}")
    private String issuerUri;

    // Bean definition for JWT Decoder
    @Bean
    public JwtDecoder jwtDecoder() {
        return JwtDecoders.fromOidcIssuerLocation(issuerUri);
    }

    // Bean definition for the Security Filter Chain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        // Configuring authorization requests
        httpSecurity.authorizeRequests()
                .requestMatchers("/api/orders/**").authenticated();

        // Configuring OAuth2 resource server with JWT decoder
        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.decoder(jwtDecoder())));

        // Configuring CORS with specific settings for allowed origins, headers, and methods
        httpSecurity.cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowCredentials(true);
            config.addAllowedOrigin("https://localhost:4200");
            config.addAllowedHeader("*");
            config.addAllowedMethod("*");
            return config;
        }));

        // Setting content negotiation strategy
        httpSecurity.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        // Configuring Okta to customize the response body for 401 responses
        Okta.configureResourceServer401ResponseBody(httpSecurity);

        // Disabling CSRF as it's typically not required for API services
        httpSecurity.csrf(csrf -> csrf.disable());

        return httpSecurity.build();
    }
}
