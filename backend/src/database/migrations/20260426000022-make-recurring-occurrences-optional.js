"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const recurringExpenses =
      await queryInterface.describeTable("recurring_expenses");
    const recurringIncomes =
      await queryInterface.describeTable("recurring_incomes");

    if (
      recurringExpenses.occurrences &&
      recurringExpenses.occurrences.allowNull === false
    ) {
      await queryInterface.changeColumn("recurring_expenses", "occurrences", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (
      recurringIncomes.occurrences &&
      recurringIncomes.occurrences.allowNull === false
    ) {
      await queryInterface.changeColumn("recurring_incomes", "occurrences", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const recurringExpenses =
      await queryInterface.describeTable("recurring_expenses");
    const recurringIncomes =
      await queryInterface.describeTable("recurring_incomes");

    if (
      recurringExpenses.occurrences &&
      recurringExpenses.occurrences.allowNull === true
    ) {
      await queryInterface.sequelize.query(
        "UPDATE recurring_expenses SET occurrences = 12 WHERE occurrences IS NULL",
      );
      await queryInterface.changeColumn("recurring_expenses", "occurrences", {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }

    if (
      recurringIncomes.occurrences &&
      recurringIncomes.occurrences.allowNull === true
    ) {
      await queryInterface.sequelize.query(
        "UPDATE recurring_incomes SET occurrences = 12 WHERE occurrences IS NULL",
      );
      await queryInterface.changeColumn("recurring_incomes", "occurrences", {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }
  },
};
