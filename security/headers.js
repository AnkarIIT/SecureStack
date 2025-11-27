/**
 * =============================================================================
 * SECURITY HEADERS MIDDLEWARE
 * Cloudflare-Compatible HTTP Security Headers
 * =============================================================================
 *
 * This middleware implements security headers recommended for production web
 * applications. It is designed for Express.js but can be easily adapted to
 * other frameworks (Fastify, Koa, Hono, etc.).
 *
 * FEATURES:
 * - Strict Transport Security (HSTS)
 * - Content Security Policy (CSP)
 * - X-Frame-Options (Clickjacking protection)
 * - X-Content-Type-Options (MIME sniffing prevention)
 * - X-XSS-Protection (Legacy XSS filter)
 * - Referrer-Policy
 * - Permissions-Policy
 * - Rate limiting headers (Cloudflare-compatible)
 *
 * USAGE:
 *   const { securityHeaders, rateLimitHeaders } = require('./security/headers');
 *
 *   // Apply to all routes
 *   app.use(securityHeaders());
 *
 *   // Apply rate limit headers to specific routes
 *   app.use('/api', rateLimitHeaders({ limit: 100, window: 60 }));
 *
 * CLOUDFLARE NOTES:
 * - Some headers (like HSTS) can also be configured in Cloudflare dashboard
 * - Cloudflare adds its own security headers; these complement them
 * - Rate limiting can be offloaded to Cloudflare's rate limiting rules
 *
 * =============================================================================
 */

/**
 * Main security headers middleware
 * @param {Object} options - Configuration options
 * @returns {Function} Express middleware function
 */
function securityHeaders(options = {}) {
  const config = {
    // Enable HSTS (HTTP Strict Transport Security)
    // Forces HTTPS for the specified duration
    hsts: {
      enabled: options.hsts?.enabled ?? true,
      maxAge: options.hsts?.maxAge ?? 31536000, // 1 year in seconds
      includeSubDomains: options.hsts?.includeSubDomains ?? true,
      preload: options.hsts?.preload ?? false, // Only enable if you're ready for HSTS preload
    },

    // Content Security Policy
    // Restricts sources for scripts, styles, images, etc.
    csp: {
      enabled: options.csp?.enabled ?? true,
      directives: options.csp?.directives ?? {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust for your needs
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: true,
      },
    },

    // X-Frame-Options (legacy clickjacking protection)
    // Prefer frame-ancestors in CSP, but this provides fallback
    xFrameOptions: options.xFrameOptions ?? 'DENY',

    // X-Content-Type-Options
    // Prevents MIME type sniffing
    xContentTypeOptions: options.xContentTypeOptions ?? 'nosniff',

    // X-XSS-Protection (legacy, but still useful for older browsers)
    xXssProtection: options.xXssProtection ?? '1; mode=block',

    // Referrer-Policy
    // Controls how much referrer information is sent
    referrerPolicy: options.referrerPolicy ?? 'strict-origin-when-cross-origin',

    // Permissions-Policy (formerly Feature-Policy)
    // Restricts browser features
    permissionsPolicy: options.permissionsPolicy ?? {
      accelerometer: [],
      camera: [],
      geolocation: [],
      gyroscope: [],
      magnetometer: [],
      microphone: [],
      payment: [],
      usb: [],
    },

    // Cross-Origin headers
    crossOrigin: {
      embedderPolicy: options.crossOrigin?.embedderPolicy ?? 'require-corp',
      openerPolicy: options.crossOrigin?.openerPolicy ?? 'same-origin',
      resourcePolicy: options.crossOrigin?.resourcePolicy ?? 'same-origin',
    },

    // Cache-Control for security-sensitive responses
    cacheControl: options.cacheControl ?? 'no-store, no-cache, must-revalidate, proxy-revalidate',
  };

  return function securityHeadersMiddleware(req, res, next) {
    // HSTS - HTTP Strict Transport Security
    if (config.hsts.enabled) {
      let hstsValue = `max-age=${config.hsts.maxAge}`;
      if (config.hsts.includeSubDomains) {
        hstsValue += '; includeSubDomains';
      }
      if (config.hsts.preload) {
        hstsValue += '; preload';
      }
      res.setHeader('Strict-Transport-Security', hstsValue);
    }

    // Content-Security-Policy
    if (config.csp.enabled) {
      const cspDirectives = [];
      const directives = config.csp.directives;

      if (directives.defaultSrc) {
        cspDirectives.push(`default-src ${directives.defaultSrc.join(' ')}`);
      }
      if (directives.scriptSrc) {
        cspDirectives.push(`script-src ${directives.scriptSrc.join(' ')}`);
      }
      if (directives.styleSrc) {
        cspDirectives.push(`style-src ${directives.styleSrc.join(' ')}`);
      }
      if (directives.imgSrc) {
        cspDirectives.push(`img-src ${directives.imgSrc.join(' ')}`);
      }
      if (directives.fontSrc) {
        cspDirectives.push(`font-src ${directives.fontSrc.join(' ')}`);
      }
      if (directives.connectSrc) {
        cspDirectives.push(`connect-src ${directives.connectSrc.join(' ')}`);
      }
      if (directives.frameSrc) {
        cspDirectives.push(`frame-src ${directives.frameSrc.join(' ')}`);
      }
      if (directives.objectSrc) {
        cspDirectives.push(`object-src ${directives.objectSrc.join(' ')}`);
      }
      if (directives.baseUri) {
        cspDirectives.push(`base-uri ${directives.baseUri.join(' ')}`);
      }
      if (directives.formAction) {
        cspDirectives.push(`form-action ${directives.formAction.join(' ')}`);
      }
      if (directives.frameAncestors) {
        cspDirectives.push(`frame-ancestors ${directives.frameAncestors.join(' ')}`);
      }
      if (directives.upgradeInsecureRequests) {
        cspDirectives.push('upgrade-insecure-requests');
      }

      res.setHeader('Content-Security-Policy', cspDirectives.join('; '));
    }

    // X-Frame-Options
    if (config.xFrameOptions) {
      res.setHeader('X-Frame-Options', config.xFrameOptions);
    }

    // X-Content-Type-Options
    if (config.xContentTypeOptions) {
      res.setHeader('X-Content-Type-Options', config.xContentTypeOptions);
    }

    // X-XSS-Protection
    if (config.xXssProtection) {
      res.setHeader('X-XSS-Protection', config.xXssProtection);
    }

    // Referrer-Policy
    if (config.referrerPolicy) {
      res.setHeader('Referrer-Policy', config.referrerPolicy);
    }

    // Permissions-Policy
    if (config.permissionsPolicy) {
      const policies = Object.entries(config.permissionsPolicy)
        .map(([feature, allowList]) => {
          const value = allowList.length > 0 ? `(${allowList.join(' ')})` : '()';
          return `${feature}=${value}`;
        })
        .join(', ');
      res.setHeader('Permissions-Policy', policies);
    }

    // Cross-Origin headers
    if (config.crossOrigin.embedderPolicy) {
      res.setHeader('Cross-Origin-Embedder-Policy', config.crossOrigin.embedderPolicy);
    }
    if (config.crossOrigin.openerPolicy) {
      res.setHeader('Cross-Origin-Opener-Policy', config.crossOrigin.openerPolicy);
    }
    if (config.crossOrigin.resourcePolicy) {
      res.setHeader('Cross-Origin-Resource-Policy', config.crossOrigin.resourcePolicy);
    }

    // Cache-Control for sensitive responses
    // Note: Only apply to HTML/API responses, not static assets
    const contentType = res.get('Content-Type') || '';
    if (!contentType.includes('image') && !contentType.includes('font') && !contentType.includes('css') && !contentType.includes('javascript')) {
      res.setHeader('Cache-Control', config.cacheControl);
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    next();
  };
}

/**
 * Rate limiting headers middleware
 * Adds headers for rate limit information (compatible with Cloudflare)
 *
 * @param {Object} options - Rate limit configuration
 * @returns {Function} Express middleware function
 *
 * NOTE: This only adds HEADERS. Actual rate limiting should be implemented
 * separately using express-rate-limit, Cloudflare, or similar.
 */
function rateLimitHeaders(options = {}) {
  const config = {
    limit: options.limit ?? 100,        // Requests per window
    window: options.window ?? 60,       // Window in seconds
    remaining: options.remaining ?? null, // If you have a rate limiter that tracks this
  };

  return function rateLimitHeadersMiddleware(req, res, next) {
    // Standard rate limit headers
    res.setHeader('X-RateLimit-Limit', config.limit);
    res.setHeader('X-RateLimit-Window', config.window);

    // If you have a rate limiter that tracks remaining requests
    if (config.remaining !== null) {
      res.setHeader('X-RateLimit-Remaining', config.remaining);
    }

    // Cloudflare-specific headers (informational)
    res.setHeader('CF-Cache-Status', 'DYNAMIC'); // Indicate dynamic content

    next();
  };
}

/**
 * Bot detection headers middleware
 * Adds headers to help identify and manage bot traffic
 *
 * NOTE: Actual bot detection should be done by Cloudflare Bot Management
 * or similar service. This middleware adds helpful headers.
 */
function botDetectionHeaders(options = {}) {
  const config = {
    challengeMode: options.challengeMode ?? false,
  };

  return function botDetectionHeadersMiddleware(req, res, next) {
    // Check for Cloudflare bot detection headers
    const cfBotScore = req.get('CF-Bot-Score');
    const cfVerifiedBot = req.get('CF-Verified-Bot');

    // Add response headers for debugging
    if (cfBotScore) {
      res.setHeader('X-Bot-Score', cfBotScore);
    }
    if (cfVerifiedBot) {
      res.setHeader('X-Verified-Bot', cfVerifiedBot);
    }

    // You can add logic here to block or challenge suspected bots
    // This is better handled by Cloudflare's bot management

    next();
  };
}

/**
 * Combine all security middlewares
 * Convenience function to apply all security headers at once
 *
 * @param {Object} options - Combined options for all middlewares
 * @returns {Function[]} Array of middleware functions
 */
function allSecurityMiddleware(options = {}) {
  return [
    securityHeaders(options.headers),
    rateLimitHeaders(options.rateLimit),
    botDetectionHeaders(options.botDetection),
  ];
}

// =============================================================================
// FRAMEWORK ADAPTERS
// Examples for adapting to other frameworks
// =============================================================================

/**
 * Fastify adapter example
 *
 * Usage:
 *   fastify.addHook('onRequest', securityHeadersFastify());
 */
function securityHeadersFastify(options = {}) {
  const middleware = securityHeaders(options);

  return async function (request, reply) {
    return new Promise((resolve) => {
      middleware(
        { get: (h) => request.headers[h.toLowerCase()] },
        {
          setHeader: (name, value) => reply.header(name, value),
          get: (name) => reply.getHeader(name),
        },
        resolve
      );
    });
  };
}

/**
 * Hono/Cloudflare Workers adapter example
 *
 * Usage:
 *   app.use('*', securityHeadersHono());
 */
function securityHeadersHono(options = {}) {
  const config = buildConfig(options);

  return async function (c, next) {
    await next();

    // Apply headers to response
    if (config.hsts.enabled) {
      let hstsValue = `max-age=${config.hsts.maxAge}`;
      if (config.hsts.includeSubDomains) hstsValue += '; includeSubDomains';
      if (config.hsts.preload) hstsValue += '; preload';
      c.header('Strict-Transport-Security', hstsValue);
    }

    // Add other headers similarly...
    c.header('X-Frame-Options', config.xFrameOptions);
    c.header('X-Content-Type-Options', config.xContentTypeOptions);
    c.header('Referrer-Policy', config.referrerPolicy);
  };
}

// Helper to build config (used by adapters)
function buildConfig(options = {}) {
  return {
    hsts: {
      enabled: options.hsts?.enabled ?? true,
      maxAge: options.hsts?.maxAge ?? 31536000,
      includeSubDomains: options.hsts?.includeSubDomains ?? true,
      preload: options.hsts?.preload ?? false,
    },
    xFrameOptions: options.xFrameOptions ?? 'DENY',
    xContentTypeOptions: options.xContentTypeOptions ?? 'nosniff',
    xXssProtection: options.xXssProtection ?? '1; mode=block',
    referrerPolicy: options.referrerPolicy ?? 'strict-origin-when-cross-origin',
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  securityHeaders,
  rateLimitHeaders,
  botDetectionHeaders,
  allSecurityMiddleware,
  // Framework adapters
  securityHeadersFastify,
  securityHeadersHono,
};

// Also export as default for ES modules
module.exports.default = securityHeaders;
