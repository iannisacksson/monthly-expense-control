"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("recurring_incomes", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      family_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "families", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      gross_income: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      income_type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      kind: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      start_month_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "months", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      occurrences: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    await queryInterface.addColumn("monthly_incomes", "recurring_income_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "recurring_incomes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addIndex(
      "monthly_incomes",
      ["recurring_income_id", "month_id"],
      {
        name: "monthly_incomes_recurring_income_id_month_id_idx",
        unique: true,
        where: {
          recurring_income_id: {
            [Sequelize.Op.ne]: null,
          },
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "monthly_incomes",
      "monthly_incomes_recurring_income_id_month_id_idx",
    );
    await queryInterface.removeColumn("monthly_incomes", "recurring_income_id");
    await queryInterface.dropTable("recurring_incomes");
  },
};
