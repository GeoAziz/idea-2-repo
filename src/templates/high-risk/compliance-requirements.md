# Compliance Requirements

## Overview
This document outlines compliance requirements based on the type of data handled.

## GDPR (General Data Protection Regulation)
**Applies if**: Handling data of EU residents

### Requirements
1. **Data Subject Rights**
   - Right to access
   - Right to erasure ("right to be forgotten")
   - Right to data portability
   - Right to rectification

2. **Implementation**
   - User data export functionality
   - Account deletion workflow
   - Data retention policies
   - Privacy policy documentation

3. **Technical Measures**
   - Data encryption
   - Access controls
   - Audit logging
   - Breach notification system

## PCI DSS (Payment Card Industry Data Security Standard)
**Applies if**: Processing credit card payments

### Requirements
1. **Never Store**
   - Full magnetic stripe data
   - CVV/CVC codes
   - PIN data

2. **Use PCI-Compliant Providers**
   - Stripe
   - PayPal
   - Square

3. **Security Measures**
   - Network segmentation
   - Regular security testing
   - Access logging

## HIPAA (Health Insurance Portability and Accountability Act)
**Applies if**: Handling protected health information (PHI)

### Requirements
1. **Administrative Safeguards**
   - Security officer designation
   - Workforce training
   - Access management

2. **Physical Safeguards**
   - Facility access controls
   - Device controls

3. **Technical Safeguards**
   - Access controls
   - Audit controls
   - Integrity controls
   - Transmission security

## COPPA (Children's Online Privacy Protection Act)
**Applies if**: Targeting children under 13

### Requirements
1. **Parental Consent**
   - Verifiable consent mechanism
   - Notice to parents

2. **Data Collection**
   - Minimal data collection
   - Parent access to data
   - Deletion upon request

## Implementation Checklist

- [ ] Identify which regulations apply
- [ ] Document compliance approach
- [ ] Implement required technical controls
- [ ] Create privacy policy
- [ ] Set up data processing agreements
- [ ] Regular compliance audits
- [ ] Staff training
