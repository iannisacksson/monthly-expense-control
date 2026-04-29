"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const recurringIncomesTable = await queryInterface.describeTable("recurring_incomes");
    const recurringExpensesTable = await queryInterface.describeTable("recurring_expenses");
    const installmentGroupsTable = await queryInterface.describeTable("installment_groups");

    if (recurringIncomesTable.family_id) {
      await queryInterface.removeColumn("recurring_incomes", "family_id");
    }

    if (recurringExpensesTable.family_id) {
      await queryInterface.removeColumn("recurring_expenses", "family_id");
    }

    if (installmentGroupsTable.family_id) {
      await queryInterface.removeColumn("installment_groups", "family_id");
    }
  },

  async down(queryInterface, Sequelize) {
    const recurringIncomesTable = await queryInterface.describeTable("recurring_incomes");
    const recurringExpensesTable = await queryInterface.describeTable("recurring_expenses");
    const installmentGroupsTable = await queryInterface.describeTable("installment_groups");

    if (!recurringIncomesTable.family_id) {
      await queryInterface.addColumn("recurring_incomes", "family_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "families", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    if (!recurringExpensesTable.family_id) {
      await queryInterface.addColumn("recurring_expenses", "family_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "families", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    if (!installmentGroupsTable.family_id) {
      await queryInterface.addColumn("installment_groups", "family_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "families", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  },
};