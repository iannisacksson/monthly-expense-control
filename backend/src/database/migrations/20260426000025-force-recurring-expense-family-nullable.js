"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE recurring_expenses
      ALTER COLUMN family_id DROP NOT NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE recurring_expenses AS recurring_expense
      SET family_id = start_month.family_id
      FROM months AS start_month
      WHERE recurring_expense.start_month_id = start_month.id
        AND recurring_expense.family_id IS NULL;
    `);

    await queryInterface.changeColumn("recurring_expenses", "family_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
};
