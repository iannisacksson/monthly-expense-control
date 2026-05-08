"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("expenses", "expense_kind", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "standard",
    });

    await queryInterface.addColumn("expenses", "planned_amount", {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });

    await queryInterface.addIndex("expenses", ["expense_kind"]);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("expenses", ["expense_kind"]);
    await queryInterface.removeColumn("expenses", "planned_amount");
    await queryInterface.removeColumn("expenses", "expense_kind");
  },
};
