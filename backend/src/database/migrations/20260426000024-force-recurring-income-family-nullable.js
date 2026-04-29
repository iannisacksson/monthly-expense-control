"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE recurring_incomes
      ALTER COLUMN family_id DROP NOT NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE recurring_incomes AS recurring_income
      SET family_id = start_month.family_id
      FROM months AS start_month
      WHERE recurring_income.start_month_id = start_month.id
        AND recurring_income.family_id IS NULL;
    `);

    await queryInterface.changeColumn("recurring_incomes", "family_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
};
