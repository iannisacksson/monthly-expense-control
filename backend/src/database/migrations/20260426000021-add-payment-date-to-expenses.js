"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("expenses");

    if (!table.payment_date) {
      await queryInterface.addColumn("expenses", "payment_date", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });
    }

    if (table.expense_date && table.expense_date.allowNull === false) {
      await queryInterface.changeColumn("expenses", "expense_date", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("expenses");

    if (table.payment_date) {
      await queryInterface.removeColumn("expenses", "payment_date");
    }

    if (table.expense_date && table.expense_date.allowNull === true) {
      await queryInterface.changeColumn("expenses", "expense_date", {
        type: Sequelize.DATEONLY,
        allowNull: false,
      });
    }
  },
};
