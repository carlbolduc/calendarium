package io.codebards.calendarium;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;
import io.codebards.calendarium.auth.CalendariumAuthorizer;
import io.codebards.calendarium.auth.TokenAuthenticator;
import io.codebards.calendarium.core.EmailManager;
import io.codebards.calendarium.core.StripeService;
import io.codebards.calendarium.core.AccountAuth;
import io.codebards.calendarium.db.Dao;
import io.codebards.calendarium.resources.AuthResource;
import io.codebards.calendarium.resources.BotResource;
import io.codebards.calendarium.resources.LocalisationsResource;
import io.codebards.calendarium.resources.OpsResource;
import io.codebards.calendarium.resources.AccountsResource;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.oauth.OAuthCredentialAuthFilter;
import io.dropwizard.configuration.EnvironmentVariableSubstitutor;
import io.dropwizard.configuration.SubstitutingSourceProvider;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.jdbi3.JdbiFactory;
import io.dropwizard.migrations.MigrationsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.jdbi.v3.core.Jdbi;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import java.util.EnumSet;

public class App extends Application<Config> {
    public static void main(String[] args) throws Exception {
        new App().run(args);
    }

    @Override
    public void initialize(Bootstrap<Config> bootstrap) {
        // Enable variable substitution with environment variables
        bootstrap.setConfigurationSourceProvider(
                new SubstitutingSourceProvider(
                        bootstrap.getConfigurationSourceProvider(),
                        new EnvironmentVariableSubstitutor(false)
                )
        );
        bootstrap.addBundle(new MigrationsBundle<>() {
            @Override
            public DataSourceFactory getDataSourceFactory(Config config) {
                return config.getDatabase();
            }
        });
        bootstrap.addBundle(new ViewBundle());
        bootstrap.addBundle(new UrlRewriteBundle());
        bootstrap.addBundle(new AssetsBundle("/assets/", "/", "index.html"));
    }

    @Override
    public void run(Config config, Environment environment) {
        final JdbiFactory jdbiFactory = new JdbiFactory();
        final Jdbi jdbi = jdbiFactory.build(environment, config.getDatabase(), "main");
        final Argon2 argon2 = Argon2Factory.create();
        final BasicAWSCredentials awsCredentials = new BasicAWSCredentials(config.getThirdPartyFactory().getAccessKey(), config.getThirdPartyFactory().getSecretKey());
        final AmazonSimpleEmailService emailClient = AmazonSimpleEmailServiceClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider((awsCredentials))).withRegion(Regions.CA_CENTRAL_1).build();
//        final AmazonS3 fileClient = AmazonS3ClientBuilder.standard().withRegion(Regions.CA_CENTRAL_1).withCredentials(new AWSStaticCredentialsProvider(awsCredentials)).build();

        final Dao dao = jdbi.onDemand(Dao.class);
        final EmailManager emailManager = new EmailManager(emailClient, config.getThirdPartyFactory().getBaseUrl());
        final StripeService stripeService = new StripeService(config.getThirdPartyFactory().getStripeApiKey());
        final OpsResource opsResource = new OpsResource(dao);
        final BotResource botResource = new BotResource(dao);
        final AuthResource authResource = new AuthResource(dao, argon2, emailManager);
        final AccountsResource accountsResource = new AccountsResource(dao, argon2, stripeService);
        final LocalisationsResource localisationsResource = new LocalisationsResource(dao);

        if (config.getThirdPartyFactory().getEnv().equals("development")) {
            setupCors(environment);
        }

        environment.jersey().register(new AuthDynamicFeature(new OAuthCredentialAuthFilter.Builder<AccountAuth>()
                .setAuthenticator(new TokenAuthenticator(dao))
                .setAuthorizer(new CalendariumAuthorizer())
                .setPrefix("Bearer")
                .buildAuthFilter()));
        environment.jersey().register(RolesAllowedDynamicFeature.class);
        //If you want to use @Auth to inject a custom Principal type into your resource
        environment.jersey().register(new AuthValueFactoryProvider.Binder<>(AccountAuth.class));
        environment.jersey().register(opsResource);
        environment.jersey().register(botResource);
        environment.jersey().register(authResource);
        environment.jersey().register(accountsResource);
        environment.jersey().register(localisationsResource);
    }

    private void setupCors(Environment environment) {
        final FilterRegistration.Dynamic filterRegistration = environment.servlets().addFilter("crossOriginRequests", CrossOriginFilter.class);
        filterRegistration.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), true, "/*");
        filterRegistration.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*");
        filterRegistration.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM, "*");
        filterRegistration.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "PUT,GET,POST,DELETE,OPTIONS");
    }
}
