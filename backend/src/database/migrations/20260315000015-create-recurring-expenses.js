"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("recurring_expenses", {
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
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "categories", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      subcategory_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "subcategories", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      paid_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      responsible_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
        type: Sequelize.STRING,
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

    await queryInterface.addColumn("expenses", "recurring_expense_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "recurring_expenses", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addIndex(
      "expenses",
      ["recurring_expense_id", "month_id"],
      {
        name: "expenses_recurring_expense_id_month_id_idx",
        unique: true,
        where: {
          recurring_expense_id: {
            [Sequelize.Op.ne]: null,
          },
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "expenses",
      "expenses_recurring_expense_id_month_id_idx",
    );
    await queryInterface.removeColumn("expenses", "recurring_expense_id");
    await queryInterface.dropTable("recurring_expenses");
  },
};
