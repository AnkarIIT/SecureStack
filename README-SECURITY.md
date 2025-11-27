# Security Infrastructure Guide

This repository is configured with production-grade security tooling. This guide explains how to set up, use, and maintain the security infrastructure.

## Quick Start

### For Local Development

```bash
# Install pre-commit hooks
pip install pre-commit
pre-commit install

# Run all checks manually
pre-commit run --all-files

# Update hooks to latest versions
pre-commit autoupdate
```

### For CI/CD (Automatic)

All security checks run automatically on:
- Every pull request
- Pushes to main/master/develop branches
- Weekly scheduled scans

---

## Security Tools Overview

| Tool | Purpose | Local | CI | Configuration |
|------|---------|-------|----|--------------| 
| **Gitleaks** | Secret detection | Pre-commit | GitHub Actions | `.pre-commit-config.yaml`, `.gitleaks.toml` |
| **Semgrep** | SAST scanning | Manual | GitHub Actions | `.github/workflows/semgrep.yml`, `semgrep-rules/` |
| **Socket.dev** | Supply chain security | N/A | GitHub App | `.github/socket.yml` |
| **Dependabot** | Dependency updates | N/A | GitHub Native | `.github/dependabot.yml` |
| **AI PR Labeler** | Detect AI code | N/A | GitHub Actions | `.github/workflows/ai-pr-labeler.yml` |

---

## 1. Gitleaks (Secret Detection)

### What It Does
Scans commits for accidentally committed secrets like:
- API keys
- AWS credentials
- Database passwords
- Private keys
- OAuth tokens

### Local Usage

```bash
# Automatically runs before each commit after installing pre-commit
git commit -m "My changes"
# If secrets found: commit blocked with details

# Manual scan of all files
gitleaks detect --source . --verbose

# Scan specific commits
gitleaks detect --source . --log-opts="HEAD~5..HEAD"
```

### Handling False Positives

Create a `.gitleaks.toml` file if needed:

```toml
[allowlist]
description = "Allowed patterns"
paths = [
  '''test/fixtures/.*''',
  '''docs/examples/.*'''
]
regexes = [
  '''example-api-key-12345''',  # Known test key
]
commits = [
  '''abc123def456'''  # Specific commit to ignore
]
```

---

## 2. Semgrep (SAST)

### What It Does
Static analysis for security vulnerabilities:
- OWASP Top 10 issues
- SQL injection
- XSS vulnerabilities
- Command injection
- Insecure crypto
- AI-generated code patterns

### Local Usage

```bash
# Install Semgrep
pip install semgrep

# Run all configured rules
semgrep scan --config=p/owasp-top-ten --config=./semgrep-rules/ .

# Run specific rule categories
semgrep scan --config=p/javascript .
semgrep scan --config=p/secrets .

# Output as SARIF for GitHub integration
semgrep scan --config=auto --sarif -o results.sarif .
```

### Custom Rules

Custom rules are in `semgrep-rules/`:
- `hardcoded-credentials.yaml` - Credential detection
- `ai-generated-patterns.yaml` - AI/Copilot code issues
- `web-security.yaml` - Web application vulnerabilities

### Adding New Rules

```yaml
# semgrep-rules/my-custom-rule.yaml
rules:
  - id: my-rule-id
    patterns:
      - pattern: dangerous_function($X)
    message: |
      Don't use dangerous_function(). Use safe_function() instead.
    severity: ERROR
    languages:
      - javascript
    metadata:
      category: security
```

---

## 3. Socket.dev (Supply Chain Security)

### What It Does
Monitors npm/pip packages for:
- Known malware
- Typosquatting attacks
- Suspicious network/filesystem access
- Vulnerable dependencies
- Abandoned packages

### Setup

1. Install the Socket GitHub App: https://github.com/apps/socket-security
2. Authorize for your repository
3. Configuration is automatic from `.github/socket.yml`

### Configuration

Edit `.github/socket.yml` to adjust sensitivity:

```yaml
issueRules:
  # Block PRs with these issues
  knownMalware:
    action: error
  criticalCVE:
    action: error
  
  # Warn but don't block
  deprecated:
    action: warn
  unpopular:
    action: ignore
```

---

## 4. Dependabot (Dependency Updates)

### What It Does
- Scans for vulnerable dependencies
- Creates PRs to update packages
- Runs weekly (configurable)

### Configuration

Edit `.github/dependabot.yml`:

```yaml
updates:
  - package-ecosystem: "npm"
    schedule:
      interval: "weekly"
      day: "monday"
    groups:
      # Group minor/patch updates
      production-dependencies:
        dependency-type: "production"
        update-types: ["minor", "patch"]
```

### Supported Ecosystems

Dependabot will automatically detect and scan:
- npm (package.json)
- pip (requirements.txt, pyproject.toml)
- Go modules (go.mod)
- Cargo/Rust (Cargo.toml)
- Composer/PHP (composer.json)
- And many more...

---

## 5. AI PR Labeler

### What It Does
Automatically detects and labels PRs that may contain AI-generated code:
- Scans PR titles, bodies, and commit messages
- Looks for AI assistant mentions (Copilot, ChatGPT, Claude, etc.)
- Adds `ai-generated` and `needs-security-review` labels

### Why It Matters
AI-generated code often contains:
- Placeholder/example credentials
- Insecure default configurations
- Missing error handling
- Subtle logic bugs

### Customization

Edit `.github/workflows/ai-pr-labeler.yml` to adjust detection patterns.

---

## 6. Security Headers Middleware

### What It Does
Adds HTTP security headers for web applications:
- HSTS (force HTTPS)
- CSP (Content Security Policy)
- X-Frame-Options (clickjacking protection)
- And more...

### Usage (Express.js)

```javascript
const { securityHeaders, rateLimitHeaders } = require('./security/headers');

const app = express();

// Apply security headers to all routes
app.use(securityHeaders());

// Apply rate limit headers to API routes
app.use('/api', rateLimitHeaders({ limit: 100, window: 60 }));
```

### Configuration

```javascript
app.use(securityHeaders({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: false
  },
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      // ... customize for your app
    }
  }
}));
```

---

## Security Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPER COMMITS                        │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PRE-COMMIT HOOKS                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Gitleaks   │  │  YAML Lint  │  │  File Size Check    │ │
│  │  (Secrets)  │  │             │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                         │                                   │
│                         ▼                                   │
│              ┌─────────────────────┐                       │
│              │  BLOCKED if issues  │                       │
│              └─────────────────────┘                       │
└─────────────────────────────┬───────────────────────────────┘
                              │ (if passed)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PULL REQUEST OPENED                      │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD SECURITY CHECKS                    │
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │   Gitleaks    │  │    Semgrep    │  │   Socket.dev    │ │
│  │   (CI scan)   │  │    (SAST)     │  │   (Supply      │ │
│  │               │  │               │  │    Chain)       │ │
│  └───────────────┘  └───────────────┘  └─────────────────┘ │
│                                                             │
│  ┌───────────────┐  ┌───────────────────────────────────┐  │
│  │  AI Labeler   │  │        Dependabot Alerts          │  │
│  │               │  │                                   │  │
│  └───────────────┘  └───────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│   ┌──────────────────────────────────────────────────┐     │
│   │  PR Status: Pass ✓ / Fail ✗ / Warnings ⚠️        │     │
│   │  Labels: security, ai-generated, needs-review    │     │
│   └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CODE REVIEW + MERGE                      │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    WEEKLY SCHEDULED SCANS                   │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │  Full Repo    │  │   Semgrep     │  │   Dependabot    │ │
│  │  Gitleaks     │  │   Deep Scan   │  │   Updates       │ │
│  └───────────────┘  └───────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Pre-commit hooks not running

```bash
# Ensure hooks are installed
pre-commit install

# Check hook status
ls -la .git/hooks/

# Re-install if needed
pre-commit uninstall && pre-commit install
```

### Gitleaks false positives

```bash
# Check what's being detected
gitleaks detect --source . --verbose --no-git

# Add to .gitleaks.toml allowlist
# See "Handling False Positives" section
```

### Semgrep rules not found

```bash
# Validate custom rules
semgrep --validate --config=./semgrep-rules/

# Check for syntax errors in YAML
yamllint semgrep-rules/
```

### Socket.dev not scanning

1. Verify GitHub App is installed
2. Check repository permissions
3. Ensure `.github/socket.yml` is valid YAML

---

## Best Practices

1. **Never disable security checks** - Fix issues, don't bypass
2. **Keep hooks updated** - Run `pre-commit autoupdate` monthly
3. **Review AI-generated code carefully** - Extra scrutiny required
4. **Don't commit commented-out security code** - Remove it
5. **Monitor Dependabot PRs** - Merge security updates promptly
6. **Run full scans before releases** - Catch anything missed

---

## Support

- **Security Issues**: See SECURITY.md for reporting vulnerabilities
- **Tool Issues**: Open a GitHub issue with logs and context
- **Questions**: Start a GitHub Discussion

---

*This security infrastructure follows industry best practices and is designed to work with free-tier tooling.*
