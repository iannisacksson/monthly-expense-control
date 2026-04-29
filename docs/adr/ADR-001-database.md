# ADR-001 — Database Selection

## Status

Accepted

---

# Context

The Finanças da Casa backend needs a database capable of supporting:

- financial transactions
- relational data structures
- strong consistency
- reliable querying
- scalable data growth

The initial architectural discussion considered two main options:

- MongoDB
- PostgreSQL

Because this project also uses AI-assisted development tools, the database technology should also:

- integrate well with the backend stack
- be easy for AI tools to generate queries and models
- support clear schema definitions

---

# Decision

The project will use:

PostgreSQL

as the primary database.

The backend will access PostgreSQL using:

Sequelize ORM.

---

# Reasons for Choosing PostgreSQL

PostgreSQL was selected because it provides:

Strong relational integrity

Financial data often has relationships such as:

users  
expenses  
categories  
households

These relationships are easier to model in a relational database.

---

Reliable transactions

Financial operations benefit from ACID guarantees.

PostgreSQL offers strong transactional support.

---

Mature ecosystem

PostgreSQL has excellent tooling and long-term reliability.

---

Compatibility with Sequelize

Sequelize has strong support for PostgreSQL, making it easier to generate models using AI tools.

---

# Alternatives Considered

## MongoDB

Pros

Flexible schema  
Fast initial development  

Cons

Weak relational modeling  
Joins handled at application level  
Harder to enforce financial data consistency  

MongoDB is more suitable for document-oriented systems.

Because this project has a **strong relational domain**, MongoDB was rejected.

---

## SQLite

Pros

Very simple setup  
Good for prototypes  

Cons

Not ideal for production  
Limited scalability  

SQLite was rejected because the system is expected to grow.

---

# Consequences

Positive outcomes

Clear relational data model  
Strong consistency for financial data  
Good compatibility with Sequelize  

Negative outcomes

More rigid schema compared to NoSQL databases.

However, this rigidity is beneficial for financial applications.

---

# AI Development Implications

AI tools generating backend code must assume:

PostgreSQL as the database  
Sequelize as the ORM  

Models must follow the schema defined in:

docs/architecture/database-model.md

AI tools must not generate MongoDB models or NoSQL queries.

---

# Related Documents

docs/architecture/database-model.md  
docs/architecture/backend-architecture.md  
docs/domain/domain-model.md