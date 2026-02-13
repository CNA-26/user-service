# User Service

User interface for OpenAPI documentation: [production](https://user-service-cna-26-user-service.2.rahtiapp.fi/api/auth/docs/), [unstable](https://user-service-devel-cna-26-user-service.2.rahtiapp.fi/api/auth/docs/).

Vår JSON Web Tokens använder HS256 kryptering och består av fåljande påståenden, med mera:  

*  "sub": användar-ID, i UUID format
*  "email":
*  "role": användarroll liksom"USER" eller "ADMIN"
*  "iat": utfärdad i, i TimeStamp format
*  "exp": utlöpas i, i TimeStamp format

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
