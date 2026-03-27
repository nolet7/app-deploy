def build_bolt_prompt(app_request: dict, template: dict) -> str:
    return f"""
Act as a senior application engineer.

Build application code only.
Do not create Terraform, Kubernetes manifests, Helm charts, cloud resources, or CI/CD workflows.
Do not hardcode secrets.
Use environment variables for all configuration.

Application request:
- App name: {app_request['app_name']}
- Description: {app_request.get('description', '')}
- Template name: {app_request['template_name']}
- Environment: {app_request['environment']}
- Requires database: {app_request['requires_database']}
- Requires cache: {app_request['requires_cache']}
- Ingress type: {app_request['ingress_type']}
- Owner team: {app_request['owner_team']}

Template metadata:
- Type: {template.get('type')}
- Framework: {template.get('framework')}
- Runtime: {template.get('runtime')}
- Description: {template.get('description')}
- Ingress expectation: {template.get('ingress')}
- Required files: {template.get('required_files')}

Required output:
- production-ready application starter code
- clear folder structure
- Dockerfile
- .env.example
- README.md
- health endpoint
- structured logging
- input validation
- starter tests

Platform constraints:
- no secrets in source code
- config must come from environment variables
- code must be container-ready
- code should support future CI/CD and Helm deployment
- keep business logic organized and readable

Return complete starter application code only.
""".strip()