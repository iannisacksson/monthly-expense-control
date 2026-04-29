# AI Backend Project Setup Guide

## Purpose

This document helps AI assistants configure the backend project from scratch.

It defines:

- project initialization
- dependency installation
- TypeScript configuration
- Express server setup
- Sequelize configuration
- PostgreSQL connection
- project folder structure

AI tools must follow these instructions when generating the initial backend configuration.

---

# Technology Stack

The backend must use the following technologies:

Runtime: Node.js  
Language: TypeScript  
Framework: Express  
ORM: Sequelize  
Database: PostgreSQL  

Do not introduce alternative frameworks.

Disallowed tools:

NestJS  
Prisma  
TypeORM  
Fastify  

---

# Step 1 — Project Initialization

Initialize the Node project.

Expected command:

npm init -y

This creates the base:

package.json

---

# Step 2 — Install Dependencies

Install runtime dependencies:


npm install express sequelize pg pg-hstore dotenv


Install development dependencies:


npm install -D typescript ts-node-dev @types/node @types/express


---

# Step 3 — TypeScript Configuration

Create the TypeScript configuration.

Expected file:


tsconfig.json


Configuration example:

```json
{
 "compilerOptions": {
  "target": "ES2020",
  "module": "commonjs",
  "rootDir": "./src",
  "outDir": "./dist",
  "strict": true,
  "esModuleInterop": true
 }
}
Step 4 — Project Folder Structure

The backend must use this structure:

src/

controllers
services
repositories
models
routes
dtos
middlewares
config
database
utils

Example:

src/
 ├ controllers
 ├ services
 ├ repositories
 ├ models
 ├ routes
 ├ dtos
 ├ middlewares
 ├ config
 ├ database
 │   ├ connection.ts
 │   └ migrations
 └ utils

AI tools must follow this structure.

Step 5 — Express Application Setup

Create the main Express application file.

Expected file:

src/app.ts

Example structure:

import express from "express"

const app = express()

app.use(express.json())

export default app
Step 6 — HTTP Server

Create the HTTP server bootstrap.

Expected file:

src/server.ts

Example:

import app from "./app"

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`)
})
Step 7 — Environment Configuration

Environment variables must be stored in:

.env

Example variables:

PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_app
DB_USER=postgres
DB_PASSWORD=postgres

Use dotenv to load environment variables.

Step 8 — Database Connection

Create the database connection file.

Expected file:

src/database/connection.ts

Example:

import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

export const sequelize = new Sequelize(
 process.env.DB_NAME!,
 process.env.DB_USER!,
 process.env.DB_PASSWORD!,
 {
  host: process.env.DB_HOST,
  dialect: "postgres"
 }
)
Step 9 — Sequelize Models

Models must be stored in:

src/models

Each model represents a table defined in:

docs/architecture/database-model.md

Example model:

import { DataTypes } from "sequelize"
import { sequelize } from "../database/connection"

export const User = sequelize.define("User", {

 id: {
  type: DataTypes.UUID,
  primaryKey: true
 },

 name: {
  type: DataTypes.STRING
 }

})
Step 10 — Routes

Routes must be stored in:

src/routes

Example route:

import { Router } from "express"

const router = Router()

router.get("/health", (req, res) => {
 res.json({ status: "ok" })
})

export default router

Routes should be imported in:

src/app.ts
Step 11 — Package Scripts

Add scripts to:

package.json

Example:

"scripts": {
 "dev": "ts-node-dev src/server.ts",
 "build": "tsc",
 "start": "node dist/server.js"
}
Step 12 — Database Migrations

Migrations must be stored in:

src/database/migrations

Sequelize CLI may be used to manage migrations.

AI Guardrails

When generating backend setup code, AI tools must follow these rules:

Use TypeScript

Use Express

Use Sequelize

Use PostgreSQL

Follow the defined folder structure

Match the database schema defined in:

docs/architecture/database-model.md

Do not introduce alternative frameworks.

Expected Result

After following this setup guide, the backend should have:

a working Express server

TypeScript configuration

Sequelize connection

PostgreSQL integration

organized folder structure