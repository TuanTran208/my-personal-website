## ADDED Requirements

### Requirement: PostgreSQL Connection
The system SHALL establish a connection pool to a PostgreSQL instance using the `DATABASE_URL` environment variable.

#### Scenario: Database pool initialized successfully
- **WHEN** the backend server starts up
- **THEN** the system SHALL initialize the PostgreSQL query pool.

### Requirement: Auto Migration on Startup
The system SHALL check database tables on startup and automatically seed them with existing local JSON data if the tables are empty.

#### Scenario: Seed data from JSON files
- **WHEN** the database tables are initialized for the first time
- **AND** `data/foodie-hub.json` exists
- **THEN** the system SHALL migrate all categories and restaurants into PostgreSQL.

### Requirement: FoodieHub DB Persistence
All restaurant CRUD operations and suggestion lookups SHALL execute SQL queries against PostgreSQL.

#### Scenario: Add a restaurant to database
- **WHEN** a new restaurant is added through `/api/foodie-hub/restaurants`
- **THEN** the system SHALL execute an `INSERT` statement to the `restaurants` table.

### Requirement: VNIndex DB Persistence
All VNIndex candles fetched by the scheduler or retrieved by the client SHALL be persisted in the database.

#### Scenario: Fetch history from database
- **WHEN** a GET request is made to `/api/vnindex`
- **THEN** the system SHALL fetch the index history records from `vnindex_history` table.
