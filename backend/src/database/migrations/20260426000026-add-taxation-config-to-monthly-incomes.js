"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("monthly_incomes", "taxation_mode", {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: "manual",
    });

    await queryInterface.addColumn("monthly_incomes", "taxation_profile", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("monthly_incomes", "taxation_parameters", {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("monthly_incomes", "taxation_parameters");
    await queryInterface.removeColumn("monthly_incomes", "taxation_profile");
    await queryInterface.removeColumn("monthly_incomes", "taxation_mode");
  },
};
