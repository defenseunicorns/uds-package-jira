# Configuration

Jira in this package is configured through the upstream [Jira chart](https://github.com/atlassian/data-center-helm-charts/tree/main/src/main/charts/jira) as well as a UDS configuration chart that supports the following parameters:

## Parameters

### Global parameters
| Name     | Description                                      | Default Value             |
|----------|--------------------------------------------------|---------------------------|
| `domain` | Sets the root domain for the application ingress | `"###ZARF_VAR_DOMAIN###"` |


### Postgres parameters
| Name                 | Description                                            | Default Value                  |
|----------------------|--------------------------------------------------------|--------------------------------|
| `postgres.internal`  | Set to `false` to use external Postgres                | `true`                         |
| `postgres.selector`  | `remoteSelector` for internal Postgres network policy  | `{cluster-name: "pg-cluster"}` |
| `postgres.username`  | External Postgres username                             | `"jira"`                  |
| `postgres.password`  | External Postgres password                             | `""`                           |
| `postgres.namespace` | `remoteNamespace` for internal Postgres network policy | `"postgres"`                   |
| `postgres.port`      | `port` for internal Postgres network policy            | `5432`                         |

### Setup parameters
| Name                       | Description                                                                | Default Value                                                         |
|-------------------------------------------------|----------------------------------------------------------------------------|-----------------------------------------------------------------------|
| `setup.admin.username`     | Username for generated admin user      | `"admin"`                  |
| `setup.admin.password`     | Password for generated admin user      | `"admin"`                  |
| `setup.admin.email`        | Email address for generated admin user | `"admin@example.com"`      |
| `setup.admin.fullname`     | Full name for generated admin user     | `"Jira Administrator"`     |
| `setup.job`                | Configuration information for setup job|                            |

### Custom parameters
The Jira license key is a custom parameter; users can input their license key to run Jira when using this package.

Example:
```yaml
jira:
  license:
    secretName: jira-license
    secretKey: license_key
    stringData:
      license_key: "<<insert license key>>"
```