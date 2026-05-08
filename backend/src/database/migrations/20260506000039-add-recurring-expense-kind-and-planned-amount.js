"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("recurring_expenses", "expense_kind", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "standard",
    });

    await queryInterface.addColumn("recurring_expenses", "planned_amount", {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("recurring_expenses", "planned_amount");
    await queryInterface.removeColumn("recurring_expenses", "expense_kind");
  },
};
