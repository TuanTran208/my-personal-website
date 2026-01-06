## ADDED Requirements

### Requirement: System Health Monitoring API
The system SHALL provide an API endpoint to retrieve current system resources including CPU load, Memory usage, and File System usage.

#### Scenario: Fetch health stats
- **WHEN** a GET request is made to `/api/health`
- **THEN** the system returns JSON object with `cpu`, `mem`, and `fs` objects containing usage percentages.

### Requirement: System Health Dashboard Widget
The frontend SHALL display a visual widget on the dashboard showing real-time system health.

#### Scenario: Display stats
- **WHEN** the dashboard loads
- **THEN** the Health Card fetches data from API
- **AND** displays CPU/RAM usage in a chart or progress bar.
