"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("monthly_incomes", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      month_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "months", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      gross_income: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      income_type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.addIndex("monthly_incomes", ["user_id"], {
      name: "monthly_incomes_user_id_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("monthly_incomes");
  },
};
