# Security Policy

## Reporting a Vulnerability

We take the security of our project seriously. If you discover a security vulnerability, please follow our responsible disclosure process.

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please report security issues via one of these methods:

1. **Email**: Send details to `security@[your-domain].com`
2. **GitHub Private Vulnerability Reporting**: Use the "Report a vulnerability" button in the Security tab
3. **PGP Encrypted Email**: For sensitive reports, use our PGP key (see below)

### What to Include

Please include as much of the following information as possible:

- **Type of vulnerability** (e.g., SQL injection, XSS, authentication bypass)
- **Full paths of affected source files** (if known)
- **Step-by-step instructions to reproduce the issue**
- **Proof-of-concept or exploit code** (if possible)
- **Impact assessment** of the vulnerability
- **Any suggested remediation** (optional but appreciated)

### Email Template

```
Subject: Security Vulnerability Report - [Brief Description]

VULNERABILITY DETAILS
=====================
Type: [e.g., SQL Injection, XSS, SSRF]
Severity: [Critical/High/Medium/Low]
Component: [Affected component or feature]

DESCRIPTION
===========
[Detailed description of the vulnerability]

STEPS TO REPRODUCE
==================
1. [First step]
2. [Second step]
3. [...]

PROOF OF CONCEPT
================
[Code, screenshots, or video demonstrating the issue]

IMPACT
======
[Description of potential impact if exploited]

REMEDIATION SUGGESTIONS (Optional)
==================================
[Your suggestions for fixing the issue]

REPORTER INFORMATION
====================
Name: [Your name or handle]
Contact: [How we can reach you for follow-up]
```

### Response Timeline

| Action | Timeline |
|--------|----------|
| Initial response | Within 48 hours |
| Vulnerability confirmation | Within 7 days |
| Status update (if fix is complex) | Every 14 days |
| Fix deployment | Varies by severity |
| Public disclosure | After fix is deployed (coordinated) |

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **Critical** | Remote code execution, data breach, full system compromise | Within 24 hours |
| **High** | Authentication bypass, significant data exposure | Within 48 hours |
| **Medium** | Limited data exposure, requires user interaction | Within 7 days |
| **Low** | Minimal impact, theoretical issues | Within 14 days |

---

## Security Measures

### Current Security Tools

This repository is protected by:

| Tool | Purpose | Status |
|------|---------|--------|
| **Gitleaks** | Secret detection in commits | Active |
| **Semgrep** | Static Application Security Testing (SAST) | Active |
| **Socket.dev** | Supply chain security | Active |
| **Dependabot** | Dependency vulnerability scanning | Active |
| **AI PR Labeler** | Flag AI-generated code for review | Active |

### Pre-commit Hooks

Developers should install pre-commit hooks to catch issues locally:

```bash
pip install pre-commit
pre-commit install
```

### CI/CD Security Checks

All pull requests undergo:

1. Secret scanning (Gitleaks)
2. SAST scanning (Semgrep)
3. Dependency scanning (Socket.dev, Dependabot)
4. AI-generated code detection

---

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| main    | :white_check_mark: |
| develop | :white_check_mark: |
| < 1.0   | :x:                |

---

## PGP Key

For encrypted communications, use our PGP public key:

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[PLACEHOLDER - Replace with your actual PGP public key]

To generate a PGP key:
1. gpg --full-generate-key
2. gpg --armor --export your@email.com > security-pgp-key.asc
3. Replace this placeholder with the contents of security-pgp-key.asc

Key Fingerprint: [Your key fingerprint]
-----END PGP PUBLIC KEY BLOCK-----
```

**Key Details:**
- **Key ID**: `[Your Key ID]`
- **Fingerprint**: `[Your Key Fingerprint]`
- **Email**: `security@[your-domain].com`

---

## Safe Harbor

We consider security research conducted under this policy to be:

- **Authorized** in accordance with the Computer Fraud and Abuse Act (CFAA)
- **Exempt** from DMCA restrictions on circumventing security measures
- **Lawful** and not subject to legal action from us

We will not pursue legal action against researchers who:

1. Make good faith efforts to avoid privacy violations and data destruction
2. Do not exploit vulnerabilities beyond what's necessary for the report
3. Report vulnerabilities promptly
4. Follow our disclosure guidelines

---

## Acknowledgments

We maintain a list of security researchers who have responsibly disclosed vulnerabilities:

| Researcher | Date | Severity | Description |
|------------|------|----------|-------------|
| - | - | - | No reports yet |

To be added to this list, please include your preferred name/handle in your report.

---

## Security Best Practices for Contributors

### Code Guidelines

1. **Never commit secrets** - Use environment variables
2. **Validate all input** - Trust nothing from users
3. **Use parameterized queries** - Prevent SQL injection
4. **Escape output** - Prevent XSS
5. **Implement proper authentication** - Use established libraries
6. **Keep dependencies updated** - Run `npm audit` / `pip-audit` regularly

### Review Checklist

Before submitting a PR, verify:

- [ ] No hardcoded credentials or API keys
- [ ] Input validation on all user-controllable data
- [ ] Output encoding/escaping in templates
- [ ] Secure headers configured for HTTP responses
- [ ] Authentication/authorization checks in place
- [ ] Sensitive data not logged or exposed in errors
- [ ] Dependencies scanned for vulnerabilities

---

## Web3/Smart Contract Security

> **Note**: This section applies only if this repository contains Solidity smart contracts (`.sol` files).

If smart contracts are added to this repository, they MUST implement:

### Required Security Patterns

1. **OpenZeppelin Pausable**
   - All contracts must inherit from `@openzeppelin/contracts/security/Pausable.sol`
   - Critical functions must use `whenNotPaused` modifier

2. **Multisig Pauser**
   - Pause functionality must require multisig approval
   - Recommended: Use Gnosis Safe or similar

3. **Access Control**
   - Use OpenZeppelin's `AccessControl` for role-based permissions
   - Define clear roles (ADMIN, PAUSER, UPGRADER, etc.)

4. **Reentrancy Protection**
   - Use `ReentrancyGuard` for all state-changing functions
   - Follow checks-effects-interactions pattern

### Required Testing (Foundry)

If `.sol` files are present, the following must exist:

```
foundry/
├── foundry.toml
├── src/
│   └── [contracts]
└── test/
    ├── Pause.t.sol         # Pause/unpause tests
    ├── AccessControl.t.sol # Permission tests
    └── Invariants.t.sol    # Invariant tests
```

**Minimum test coverage:**
- Pause/unpause functionality
- Access control (authorized vs unauthorized)
- Revert paths for invalid inputs
- Reentrancy attack vectors

---

## Contact

- **Security Issues**: `security@[your-domain].com`
- **General Questions**: Open a GitHub Discussion
- **Urgent Issues**: [Provide alternative contact method]

---

*Last updated: November 2024*
