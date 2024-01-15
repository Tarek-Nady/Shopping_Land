// Package declaration
package com.tarek.ecommerceapp.config;

// Import statements
import ...;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

// @Configuration annotation indicates that this class is a configuration class
@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    // Property injection for allowed origins
    @Value("${allowed.origins}")
    private String[] allowedOrigins;

    // Entity manager to interact with entity metadata
    private EntityManager entityManager;

    // Autowiring EntityManager through the constructor
    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }

    // Overriding configureRepositoryRestConfiguration from RepositoryRestConfigurer
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        // Define HTTP methods that should be disabled for the entities
        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        // Disabling HTTP methods for various domain types
        disableHttpMethod(Product.class, config, theUnsupportedActions);
        disableHttpMethod(ProductCategory.class, config, theUnsupportedActions);
        // ... additional entities

        // Exposing entity IDs
        exposeIds(config);

        // Configuring CORS mappings
        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(allowedOrigins);
    }

    // Helper method to disable HTTP methods for a given domain type
    private static void disableHttpMethod(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    // Helper method to expose entity IDs
    private void exposeIds(RepositoryRestConfiguration config) {
        // Get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        List<Class> entityClasses = new ArrayList<>();
        for (EntityType tempEntityType : entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }

        // Expose the entity IDs for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
