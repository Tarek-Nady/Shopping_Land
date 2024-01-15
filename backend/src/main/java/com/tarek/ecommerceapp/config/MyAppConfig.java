// Package declaration
package com.tarek.ecommerceapp.config;

// Import statements
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration annotation indicates that this class is a configuration class
@Configuration
public class MyAppConfig implements WebMvcConfigurer {

    // @Value annotation is used to inject property values into fields
    // Here, it's injecting the value of 'allowed.origins' property into the 'allowedOrigins' array
    @Value("${allowed.origins}")
    private String[] allowedOrigins;

    // Injecting the base path for Spring Data REST from the application properties
    @Value("${spring.data.rest.base-path}")
    private String basePath;

    // Overriding the addCorsMappings method from the WebMvcConfigurer interface
    @Override
    public void addCorsMappings(CorsRegistry cors) {
        // Configuring CORS mappings
        // This will apply CORS settings to all endpoints under the base path
        cors.addMapping(basePath+"/**").allowedOrigins(allowedOrigins);
    }
}
