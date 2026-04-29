"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("recurring_incomes");

    if (table.family_id && table.family_id.allowNull === false) {
      await queryInterface.changeColumn("recurring_incomes", "family_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "families", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("recurring_incomes");

    if (table.family_id && table.family_id.allowNull === true) {
      await queryInterface.sequelize.query(`
        UPDATE recurring_incomes
        SET family_id = start_month.family_id
        FROM months AS start_month
        WHERE recurring_incomes.start_month_id = start_month.id
          AND recurring_incomes.family_id IS NULL;
      `);

      await queryInterface.changeColumn("recurring_incomes", "family_id", {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "families", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  },
};
