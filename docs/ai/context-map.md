# AI Context Map

This document defines which documentation files must be used for each type of AI task.

AI tools must consult this map before generating code.

---

# Backend Project Setup

When generating the initial backend setup, read:

docs/ai/backend-project-setup.md  
docs/architecture/backend-architecture.md  
docs/ai/backend-coding-rules.md  

Used for:

- project initialization
- package.json generation
- TypeScript configuration
- Express setup
- Sequelize setup
- database connection

---

# Database Modeling

When generating models, migrations, or repositories, read:

docs/architecture/database-model.md  
docs/domain/domain-model.md  
docs/ai/backend-coding-rules.md  

Used for:

- Sequelize models
- database migrations
- repositories
- entity mapping

---

# Business Logic Implementation

When implementing business logic or services, read:

docs/domain/domain-model.md  
docs/domain/aggregates.md  
docs/domain/events.md  

Used for:

- service layer
- business rules
- domain logic

---

# API Endpoints

When generating controllers or routes, read:

docs/architecture/backend-architecture.md  
docs/domain/domain-model.md  
docs/ai/backend-coding-rules.md  

Used for:

- controllers
- routes
- request validation
- DTOs