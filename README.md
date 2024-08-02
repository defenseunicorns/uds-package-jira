# 🏪 UDS Jira Zarf Package

[![Latest Release](https://img.shields.io/github/v/release/defenseunicorns/uds-package-jira)](https://github.com/defenseunicorns/uds-package-jira/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/defenseunicorns/uds-package-jira/tag-and-release.yaml)](https://github.com/defenseunicorns/uds-package-jira/actions/workflows/tag-and-release.yaml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/defenseunicorns/uds-package-jira/badge)](https://api.securityscorecards.dev/projects/github.com/defenseunicorns/uds-package-jira)

This package is designed to be deployed on [UDS Core](https://github.com/defenseunicorns/uds-core), and is based on the upstream [Jira](https://github.com/atlassian/data-center-helm-charts/tree/main/src/main/charts/jira) chart.

## Pre-requisites

The Jira Package expects to be deployed on top of [UDS Core](https://github.com/defenseunicorns/uds-core) with the dependencies listed below being configured prior to deployment.

Jira is configured by default to assume the internal dependencies that are used for testing (see postgres in the [bundle](bundle/uds-bundle.yaml)).

#### Database

- A Postgres database is running on port `5432` and accessible to the cluster via the `JIRA_DB_ENDPOINT` Zarf var.
- This database can be logged into via the username configured with the Zarf var `JIRA_DB_USERNAME`. Default is `jira.jira`
- This database instance has a psql database created matching what is defined in the Zarf var `JIRA_DB_NAME`. Default is `jiradb`
- The user has read/write access to the above mentioned database
- Create `jira-postgres` service in `jira` namespace that points to the psql database
- Create `jira-postgres` secret in `jira` namespace with the key `password` that contains the password to the user for the psql database

## Flavors

| Flavor    | Description                                            | Example Creation                     |
| --------- | ------------------------------------------------------ | ------------------------------------ |
| upstream  | Uses images from docker.io within the package.         | `zarf package create . -f upstream`  |
| registry1 | Uses images from registry1.dso.mil within the package. | `zarf package create . -f registry1` |

> [!IMPORTANT]
> **NOTE:** To create the registry1 flavor you will need to be logged into Iron Bank - you can find instructions on how to do this in the [Big Bang Zarf Tutorial](https://docs.zarf.dev/tutorials/6-big-bang/#setup).

## Releases

The released packages can be found in [ghcr](https://github.com/defenseunicorns/uds-package-jira/pkgs/container/packages%2Fuds%2Fjira).

## UDS Tasks (for local dev and CI)

*For local dev, this requires you install [uds-cli](https://github.com/defenseunicorns/uds-cli?tab=readme-ov-file#install)

> [!TIP]
> To get a list of tasks to run you can use `uds run --list`!

## Contributing

Please see the [CONTRIBUTING.md](./CONTRIBUTING.md)
