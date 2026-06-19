## ADDED Requirements
### Requirement: Discord Authentication Flow
The system SHALL allow users to authenticate using their Discord account via standard OAuth2 protocols.

#### Scenario: User initiates login
- **WHEN** the user clicks the "Login with Discord" button
- **THEN** they are redirected to the Discord OAuth authorization consent page

#### Scenario: Successful login callback
- **WHEN** Discord redirects back with a valid authorization code
- **THEN** the backend issues a signed JWT token to the client containing their basic Discord profile information and role status

### Requirement: Owner Role-Based Access Control
The system SHALL protect specific components, optionally granting or denying features based on an 'Owner' role.

#### Scenario: Owner accessing protected tool
- **WHEN** the authenticated user's Discord ID matches the configured `OWNER_DISCORD_ID` environment variable
- **THEN** they CAN seamlessly access the Stock Tracker, NAS Server, AI Agent, Home Assistant, and Course Management dashboards

#### Scenario: Regular user accessing protected tool
- **WHEN** an unauthenticated user or guest tries to navigate to a protected dashboard route
- **THEN** the system SHALL redirect them back to the Home board or display an 'Access Denied' restriction message
