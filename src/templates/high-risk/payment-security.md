# Payment Security Guidelines

## Scope
These guidelines apply to any system that processes or facilitates payments.

## Requirements
- Use PCI-compliant payment processors (Stripe, PayPal, Square).
- Avoid storing cardholder data on your servers.
- Use tokenization for payment details.
- Enforce TLS for all payment flows.

## Operational Controls
- Monitor payment errors and fraud signals.
- Maintain audit logs for payment actions.
- Review access permissions for payment systems quarterly.
