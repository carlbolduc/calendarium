package io.codebards.calendarium;

import io.dropwizard.ConfiguredBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.tuckey.web.filters.urlrewrite.UrlRewriteFilter;

import javax.servlet.FilterRegistration;

public class UrlRewriteBundle implements ConfiguredBundle<Config> {
    private static final String DEFAULT_CONF_PATH = "urlrewrite.xml";

    private final String rewriteConfPath;


    public UrlRewriteBundle() {
        this(null);
    }

    public UrlRewriteBundle(String rewriteConfPath) {
        this.rewriteConfPath = rewriteConfPath;
    }

    @Override
    public void run(Config config, Environment environment) throws Exception {
        FilterRegistration.Dynamic registration = environment.servlets()
                .addFilter("UrlRewriteFilter", new UrlRewriteFilter());
        registration.addMappingForUrlPatterns(null, true, "/*");
        registration.setInitParameter("confPath", getConfPath(config));
    }

    /**
     * The UrlRewriteFilter will will look for a file on the classpath.
     * We will use the following to resolve the path:
     * <p>
     * 1. From the config.
     * 2. If not in the config, passed to the constructor.
     * 3. If not in the constructor, use the default.
     */
    private String getConfPath(Config config) {
        return config.getRewriteConfPath() != null
                ? config.getRewriteConfPath()
                : this.rewriteConfPath != null
                ? this.rewriteConfPath
                : DEFAULT_CONF_PATH;
    }

    @Override
    public void initialize(Bootstrap<?> bootstrap) { /* nothing */ }
}
