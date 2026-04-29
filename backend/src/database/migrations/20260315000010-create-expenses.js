"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("expenses", {
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
      month_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "months", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      installment_group_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "installment_groups", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      expense_date: {
        type: Sequelize.DATEONLY,
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

    await queryInterface.addIndex("expenses", ["family_id", "month_id"], {
      name: "expenses_family_id_month_id_idx",
    });

    await queryInterface.addIndex("expenses", ["category_id"], {
      name: "expenses_category_id_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("expenses");
  },
};
