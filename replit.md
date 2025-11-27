# Security Infrastructure Repository

## Overview

This repository contains a production-ready security infrastructure setup for any codebase. It provides automated security scanning, secret detection, dependency analysis, and web security hardening. Includes a landing page showcasing all security tools.

**Current State**: Security tooling fully configured with landing page.

## Project Structure

```
├── client/src/
│   ├── pages/
│   │   └── home.tsx            # Security landing page
│   └── App.tsx                 # Main app router
├── .github/
│   ├── dependabot.yml          # Multi-ecosystem dependency updates
│   ├── socket.yml              # Supply chain security config
│   └── workflows/
│       ├── gitleaks.yml        # CI-based secret detection
│       ├── semgrep.yml         # SAST scanning workflow
│       └── ai-pr-labeler.yml   # AI-generated code detection
├── semgrep-rules/
│   ├── hardcoded-credentials.yaml  # Credential detection rules
│   ├── ai-generated-patterns.yaml  # AI/Copilot code issues
│   └── web-security.yaml           # Web app vulnerabilities
├── security/
│   └── headers.js              # Express.js security headers middleware
├── .gitignore                  # Comprehensive secret/cache patterns
├── .pre-commit-config.yaml     # Local pre-commit hooks
├── .gitleaks.toml              # Gitleaks configuration
├── SECURITY.md                 # Security policy & disclosure
└── README-SECURITY.md          # Security tools usage guide
```

## Recent Changes

| Date | Change |
|------|--------|
| Nov 2024 | Initial security infrastructure setup |
| Nov 2024 | Added Gitleaks, Semgrep, Socket.dev, Dependabot |
| Nov 2024 | Created custom Semgrep rules for AI-generated code |
| Nov 2024 | Added Express.js security headers middleware |
| Nov 2024 | Added security landing page showcasing all tools |

## Security Tools Summary

| Tool | Purpose | Location |
|------|---------|----------|
| Gitleaks | Secret detection | Pre-commit + CI |
| Semgrep | SAST scanning | CI + Custom rules |
| Socket.dev | Supply chain security | GitHub App |
| Dependabot | Dependency updates | GitHub Native |
| AI PR Labeler | Detect AI code | GitHub Actions |
| Security Headers | HTTP security | Express middleware |

## User Preferences

- Stack-agnostic configuration
- No React/Express app scaffolding
- Free-tier tools only
- Weekly Dependabot updates
- Both local hooks and CI enforcement

## Setup Instructions

### Local Development

```bash
# Install pre-commit hooks
pip install pre-commit
pre-commit install
```

### GitHub Setup

1. Install Socket.dev GitHub App
2. Enable Dependabot alerts in repository settings
3. CI workflows run automatically on PR/push

## Architecture Decisions

1. **Pre-commit + CI dual enforcement**: Catches issues locally and in CI (doesn't rely on developers having hooks)
2. **Multi-ecosystem Dependabot**: Scans npm, pip, go, cargo, docker, etc.
3. **Custom Semgrep rules**: Focus on AI-generated code patterns and common web vulnerabilities
4. **Express middleware example**: Framework-agnostic comments for easy adaptation
5. **Comprehensive .gitignore**: Covers secrets across all major languages/frameworks

## Notes for Development

- Web code will eventually be added; security headers middleware is ready
- Smart contract security documented but not implemented (no .sol files yet)
- All configs use stable versions with CI-tested patterns
