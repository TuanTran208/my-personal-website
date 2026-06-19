## ADDED Requirements
### Requirement: Core UI Stability & Polish
The UI SHALL be functionally stable during development and exhibit professional aesthetics without critical accessibility or visual bugs.

#### Scenario: Running the dev server safely
- **WHEN** a developer runs `npm run dev`
- **THEN** the server starts successfully without crashing due to Vue DevTools `localStorage` node environment errors

#### Scenario: Rendering tool cards professionally
- **WHEN** the user views the dashboard
- **THEN** all tool cards display consistent, scalable SVG icons instead of native OS-dependent emojis

#### Scenario: View system health over time securely
- **WHEN** the user opens and subsequently closes the System Health Card
- **THEN** the periodic data polling interval is properly cleared to prevent browser tab memory leaks

#### Scenario: Resolving dark mode flashes
- **WHEN** the user loads the app in light mode
- **THEN** the screen does not flash a hardcoded dark background from the base css layer
