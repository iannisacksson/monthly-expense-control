"use strict";

async function hasIndex(queryInterface, tableName, indexName) {
  const indexes = await queryInterface.showIndex(tableName);
  return indexes.some((index) => index.name === indexName);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categoriesTable = await queryInterface.describeTable("categories");
    const budgetRulesTable = await queryInterface.describeTable("budget_rules");
    const expensesTable = await queryInterface.describeTable("expenses");

    if (
      await hasIndex(
        queryInterface,
        "expenses",
        "expenses_family_id_month_id_idx",
      )
    ) {
      await queryInterface.removeIndex(
        "expenses",
        "expenses_family_id_month_id_idx",
      );
    }

    if (expensesTable.family_id) {
      await queryInterface.removeColumn("expenses", "family_id");
    }

    if (
      !(await hasIndex(queryInterface, "expenses", "expenses_month_id_idx"))
    ) {
      await queryInterface.addIndex("expenses", ["month_id"], {
        name: "expenses_month_id_idx",
      });
    }

    if (categoriesTable.family_id) {
      await queryInterface.removeColumn("categories", "family_id");
    }

    if (budgetRulesTable.family_id) {
      await queryInterface.removeColumn("budget_rules", "family_id");
    }
  },

  async down(queryInterface, Sequelize) {
    const categoriesTable = await queryInterface.describeTable("categories");
    const budgetRulesTable = await queryInterface.describeTable("budget_rules");
    const expensesTable = await queryInterface.describeTable("expenses");

    if (!categoriesTable.family_id) {
      await queryInterface.addColumn("categories", "family_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "families", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    if (!budgetRulesTable.family_id) {
      await queryInterface.addColumn("budget_rules", "family_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "families", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    if (await hasIndex(queryInterface, "expenses", "expenses_month_id_idx")) {
      await queryInterface.removeIndex("expenses", "expenses_month_id_idx");
    }

    if (!expensesTable.family_id) {
      await queryInterface.addColumn("expenses", "family_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "families", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    if (
      !(await hasIndex(
        queryInterface,
        "expenses",
        "expenses_family_id_month_id_idx",
      ))
    ) {
      await queryInterface.addIndex("expenses", ["family_id", "month_id"], {
        name: "expenses_family_id_month_id_idx",
      });
    }
  },
};
