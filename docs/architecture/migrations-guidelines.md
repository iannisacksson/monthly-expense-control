Generate Sequelize migrations for the backend project.

Use the documentation inside /docs as the source of truth.

Follow:

docs/domain/domain-model.md
docs/architecture/database-model.md
docs/architecture/backend-architecture.md
docs/domain/validation-rules.md

Requirements:

Database: PostgreSQL
ORM: Sequelize
Language: TypeScript

Tasks:

1. Analyze the domain model and database model documentation.
2. Identify all entities and their attributes.
3. Generate Sequelize migrations to create the database schema.

Each migration must include:

- table creation
- primary key
- foreign keys
- indexes
- timestamps (created_at, updated_at)

Naming conventions:

snake_case for tables and columns.

Example:

users
expenses
categories

Migration files must follow Sequelize CLI format:

up()
down()

Place migrations inside:

src/database/migrations

Ensure:

- proper foreign key constraints
- referential integrity
- nullable rules based on validation rules
- correct PostgreSQL types