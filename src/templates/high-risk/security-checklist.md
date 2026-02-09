# Security Checklist

## Critical Security Requirements

### Authentication & Authorization
- [ ] Implement MFA for all users
- [ ] Use secure session management
- [ ] Implement rate limiting on auth endpoints
- [ ] Add account lockout after failed attempts
- [ ] Use secure password hashing (bcrypt, Argon2)

### Data Protection
- [ ] Encrypt sensitive data at rest (AES-256)
- [ ] Use TLS 1.3 for data in transit
- [ ] Implement proper key management
- [ ] Add data anonymization where possible
- [ ] Regular backup with encryption

### Input Validation
- [ ] Sanitize all user inputs
- [ ] Implement CSRF protection
- [ ] Add XSS prevention measures
- [ ] Validate file uploads (type, size, content)
- [ ] Use parameterized queries (prevent SQL injection)

### API Security
- [ ] Implement API authentication (JWT, OAuth2)
- [ ] Add request rate limiting
- [ ] Validate all API inputs
- [ ] Implement CORS properly
- [ ] Add API versioning

### Infrastructure
- [ ] Keep dependencies updated
- [ ] Run security scanners (Snyk, Dependabot)
- [ ] Implement web application firewall (WAF)
- [ ] Add DDoS protection
- [ ] Monitor for security incidents

### Compliance
- [ ] GDPR compliance (if handling EU data)
- [ ] CCPA compliance (if handling CA data)
- [ ] PCI DSS (if handling payments)
- [ ] HIPAA (if handling health data)
- [ ] COPPA (if handling children's data)

### Monitoring & Logging
- [ ] Log all authentication attempts
- [ ] Monitor for suspicious activity
- [ ] Set up alerting for security events
- [ ] Implement audit trail
- [ ] Regular security reviews

## Security Tools to Integrate

- **SAST**: SonarQube, ESLint security plugins
- **DAST**: OWASP ZAP
- **Dependency Scanning**: Snyk, npm audit
- **Secrets Detection**: GitGuardian, TruffleHog
- **Container Scanning**: Trivy, Clair
