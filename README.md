# CampConnect Angular Frontend

This is the team's Angular 19 frontend. The original interface remains owned
by the frontend team and is intentionally preserved.

The repository includes non-visual integration building blocks for the Events
and Notifications modules:

- Keycloak Authorization Code Flow with PKCE
- bearer-token attachment for `/api/**` requests
- typed Events and Notifications API models
- API clients for event listing, creation, registration, and notification reads
- local and Nginx proxying through the API Gateway

These modules do not replace or redesign existing team pages. Frontend owners
can inject the services into their own components when integrating the two
modules.

## API Contracts

The application calls relative gateway URLs:

| Method and route | Purpose |
| --- | --- |
| `GET /api/events?published=true` | Public event catalogue |
| `POST /api/events` | Organizer event creation |
| `POST /api/events/{id}/registrations` | Participant registration |
| `GET /api/notifications?recipientId={sub}` | Current user's notifications |
| `PATCH /api/notifications/{id}/read` | Mark one notification read |
| `PATCH /api/notifications/recipient/{sub}/read-all` | Mark all read |

The recipient/participant identifier is the Keycloak token `sub`, giving the
event and notification services one stable identity value.

## Local Development

Start Keycloak on port `8180` and the gateway on `9001`, then run:

```bash
npm ci
npm start
```

`proxy.conf.json` forwards API and Swagger traffic to the gateway. Open
http://localhost:4200.

## Build and Test

```bash
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
docker build -t campconnect/frontend .
```

The production image serves the Angular bundle through Nginx and proxies
`/api`, `/openapi`, and Swagger requests to `api-gateway:9001`.

## Authentication Configuration

The Keycloak URL uses the current browser hostname with port `8180`, realm
`campconnect`, and public client `campconnect-web`. The matching realm import
and development accounts are maintained in the deployment repository.

For a cloud deployment, expose Keycloak through the same ingress and replace
the local port-based URL with runtime configuration.

## Integration Structure

- `src/app/core`: Keycloak service and HTTP interceptor
- `src/app/models`: event and notification API contracts
- `src/app/services`: typed API clients
- `src/app/app.component.*`: root outlet for the team's routed interface
- `nginx.conf`: production API proxy and SPA fallback
