"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("recurring_budget_items", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      start_month_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "months",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      planned_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      occurrences: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.createTable("monthly_budget_items", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      month_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "months",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      recurring_budget_item_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "recurring_budget_items",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      planned_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("monthly_budget_items", [
      "user_id",
      "month_id",
    ]);
    await queryInterface.addIndex("monthly_budget_items", ["category_id"]);
    await queryInterface.addIndex(
      "monthly_budget_items",
      ["recurring_budget_item_id", "month_id"],
      { unique: true },
    );

    await queryInterface.createTable("monthly_budget_item_entries", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      monthly_budget_item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "monthly_budget_items",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("monthly_budget_item_entries", [
      "monthly_budget_item_id",
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("monthly_budget_item_entries");
    await queryInterface.dropTable("monthly_budget_items");
    await queryInterface.dropTable("recurring_budget_items");
  },
};
