# Security policy

## Supported versions

Security fixes are applied to the latest released version of My Honda+ Vehicle Card.

| Version | Supported |
|---|---|
| 0.5.x | Yes |
| < 0.5 | No |

## Reporting a vulnerability

Do not open a public issue for vulnerabilities that could expose Home Assistant data, vehicle information or user actions.

Use GitHub's private vulnerability reporting feature for this repository. Include:

- affected version;
- reproduction steps;
- expected and observed behavior;
- potential impact;
- suggested mitigation, when available.

Do not include VINs, coordinates, access tokens, entity states or screenshots containing private information.

## Scope

Relevant reports include:

- unintended disclosure of Home Assistant or vehicle data;
- execution of a different service than the one selected by the user;
- bypass of confirmation for sensitive actions;
- unsafe handling of custom images or configuration values;
- compromised build or release dependencies.

The card does not connect directly to Honda and does not store credentials. Security issues in the upstream My Honda+ integration should be reported to that project.
