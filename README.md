# User Service

User interface for OpenAPI documentation: [unstable](https://user-service-devel-cna-26-user-service.2.rahtiapp.fi/api/auth/docs/), [production](https://user-service-cna-26-user-service.2.rahtiapp.fi/api/auth/docs/)

## Instructions for Developers

### For deployment to [CSC Rahti](https://docs.csc.fi/cloud/rahti/)

Note: OpenShift wants the main branch to be named *master* by default, you have two options:
1. Push to origin/master to deploy
2. Change the setting in Openshift to *main*:    
    Edit BuildConfig ==> Show advanced git options ==> Git reference: `main`

### For local real-time development

Rename `.env-example` to `.env` to override the `MODE=production`set in the `Dockerfile`. Note that this needs a valueless declaration of `MODE` in `docker-compose.yml`

To run the container locally:
`docker-compose up --build`
