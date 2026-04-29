"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("months", "budget_rule_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "budget_rules",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("months", "budget_rule_id");
  },
};
