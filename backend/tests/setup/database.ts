import { afterAll, afterEach, beforeAll } from "vitest"
import { sequelize } from "../../src/database/connection"
import "../../src/models"

async function truncateAllTables() {
  const tableNames = Object.values(sequelize.models)
    .map((model) => model.getTableName())
    .map((tableName) => (typeof tableName === "string" ? tableName : tableName.tableName))
    .filter((tableName, index, allNames) => !!tableName && allNames.indexOf(tableName) === index)

  if (tableNames.length === 0) {
    return
  }

  const quotedTables = tableNames.map((tableName) => sequelize.getQueryInterface().queryGenerator.quoteTable(tableName))

  await sequelize.query(`TRUNCATE TABLE ${quotedTables.join(", ")} RESTART IDENTITY CASCADE;`)
}

beforeAll(async () => {
  await sequelize.authenticate()
})

afterEach(async () => {
  await truncateAllTables()
})

afterAll(async () => {
  await sequelize.close()
})