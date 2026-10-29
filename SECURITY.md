# Security Policy

> **In short:** report a suspected vulnerability privately, never in a public issue; reports against the current release line are assessed and fixed case by case, with no promise of backports.

## Supported releases

Theme Manager is pre-1.0, and no release establishes stable API compatibility or a general-availability support commitment. The [changelog](CHANGELOG.md) lists the releases.

Security fixes are developed on the maintained development line. Reports affecting any release in the current release line (the releases sharing its minor version, withdrawn ones included) are in scope for assessment and remediation. Earlier release lines are not supported baselines. This policy promises no automatic backports or maintenance releases: maintainers decide affected versions, mitigations, backports and patch releases case by case.

## Reporting a vulnerability

Please **do not open a public GitHub Issue, Discussion or pull request for a suspected vulnerability**.

Use this repository's GitHub **private vulnerability reporting** facility when it is enabled for public operation. This allows the maintainers to receive, discuss and remediate a report without disclosing it publicly.

A useful report includes:

- the affected component, entry point or version/commit;
- a clear description of the vulnerability and its security impact;
- reproducible steps or a minimal proof of concept;
- relevant configuration or environmental assumptions; and
- any suggested mitigation, if known.

Do not include secrets, personal data or unrelated sensitive information.

If private vulnerability reporting is temporarily unavailable, do not publish exploit details. Contact the repository maintainer through the private contact method published on the maintainer's GitHub profile.

## Scope

Security-sensitive Theme Manager surfaces include, but are not limited to:

- Theme Definition parsing, validation, import and export;
- runtime application of user-controlled Theme values;
- semantic asset references and URL-like values;
- Theme persistence boundaries;
- management routes and server endpoints;
- actor-context and authorisation integration boundaries;
- package exports and composition behaviour; and
- dependency, build and CI/CD supply-chain integrity.

Authentication, authorisation policy, physical asset storage and consuming-application security remain responsibilities of their owning capabilities or host application, but boundary failures in Theme Manager are in scope.

## Coordinated disclosure

Please allow the maintainers reasonable time to investigate and prepare a fix before public disclosure. The project will aim to acknowledge a valid report promptly, assess its impact, develop and verify remediation, and coordinate disclosure appropriate to the severity.

Good-faith security research that avoids privacy violations, data destruction, service disruption and unnecessary access is welcome.

## Security expectations for contributions

Security fixes are subject to the same architecture, testing and review requirements as other changes. A security fix must not bypass public contracts or move Authentication, Identity or Authorisation policy into Theme Manager merely to address an integration concern.
