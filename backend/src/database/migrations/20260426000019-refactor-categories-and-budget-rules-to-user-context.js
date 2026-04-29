"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categoriesTable = await queryInterface.describeTable("categories");
    const budgetRulesTable = await queryInterface.describeTable("budget_rules");

    if (!categoriesTable.user_id) {
      await queryInterface.addColumn("categories", "user_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    if (!budgetRulesTable.user_id) {
      await queryInterface.addColumn("budget_rules", "user_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    await queryInterface.sequelize.query(`
      UPDATE categories AS c
      SET user_id = single_member.user_id
      FROM (
        SELECT family_id, (ARRAY_AGG(user_id))[1] AS user_id
        FROM family_members
        GROUP BY family_id
        HAVING COUNT(*) = 1
      ) AS single_member
      WHERE c.family_id = single_member.family_id
        AND c.user_id IS NULL;
    `);

    await queryInterface.sequelize.query(`
      UPDATE budget_rules AS b
      SET user_id = single_member.user_id
      FROM (
        SELECT family_id, (ARRAY_AGG(user_id))[1] AS user_id
        FROM family_members
        GROUP BY family_id
        HAVING COUNT(*) = 1
      ) AS single_member
      WHERE b.family_id = single_member.family_id
        AND b.user_id IS NULL;
    `);

    await queryInterface.changeColumn("categories", "family_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("budget_rules", "family_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    const categoryIndexes = await queryInterface.showIndex("categories");
    if (
      !categoryIndexes.some((index) => index.name === "categories_user_id_idx")
    ) {
      await queryInterface.addIndex("categories", ["user_id"], {
        name: "categories_user_id_idx",
      });
    }

    const budgetRuleIndexes = await queryInterface.showIndex("budget_rules");
    if (
      !budgetRuleIndexes.some(
        (index) => index.name === "budget_rules_user_id_idx",
      )
    ) {
      await queryInterface.addIndex("budget_rules", ["user_id"], {
        name: "budget_rules_user_id_idx",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("categories", "categories_user_id_idx");
    await queryInterface.removeIndex(
      "budget_rules",
      "budget_rules_user_id_idx",
    );

    await queryInterface.changeColumn("categories", "family_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("budget_rules", "family_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.removeColumn("budget_rules", "user_id");
    await queryInterface.removeColumn("categories", "user_id");
  },
};
