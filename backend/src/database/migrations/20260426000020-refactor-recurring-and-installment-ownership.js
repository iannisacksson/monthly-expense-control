"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const recurringExpensesTable =
      await queryInterface.describeTable("recurring_expenses");
    const installmentGroupsTable =
      await queryInterface.describeTable("installment_groups");

    if (!recurringExpensesTable.user_id) {
      await queryInterface.addColumn("recurring_expenses", "user_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    if (!installmentGroupsTable.user_id) {
      await queryInterface.addColumn("installment_groups", "user_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    await queryInterface.sequelize.query(`
      UPDATE recurring_expenses AS r
      SET user_id = COALESCE(
        m.user_id,
        (
          SELECT (ARRAY_AGG(fm.user_id))[1]
          FROM family_members AS fm
          WHERE fm.family_id = r.family_id
          GROUP BY fm.family_id
          HAVING COUNT(*) = 1
        )
      )
      FROM months AS m
      WHERE r.start_month_id = m.id
        AND r.user_id IS NULL;
    `);

    await queryInterface.sequelize.query(`
      UPDATE installment_groups AS i
      SET user_id = COALESCE(
        m.user_id,
        (
          SELECT (ARRAY_AGG(fm.user_id))[1]
          FROM family_members AS fm
          WHERE fm.family_id = i.family_id
          GROUP BY fm.family_id
          HAVING COUNT(*) = 1
        )
      )
      FROM months AS m
      WHERE i.start_month_id = m.id
        AND i.user_id IS NULL;
    `);

    await queryInterface.changeColumn("recurring_expenses", "family_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("installment_groups", "family_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("recurring_incomes", "family_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    const recurringExpenseIndexes =
      await queryInterface.showIndex("recurring_expenses");
    if (
      !recurringExpenseIndexes.some(
        (index) => index.name === "recurring_expenses_user_id_idx",
      )
    ) {
      await queryInterface.addIndex("recurring_expenses", ["user_id"], {
        name: "recurring_expenses_user_id_idx",
      });
    }

    const installmentGroupIndexes =
      await queryInterface.showIndex("installment_groups");
    if (
      !installmentGroupIndexes.some(
        (index) => index.name === "installment_groups_user_id_idx",
      )
    ) {
      await queryInterface.addIndex("installment_groups", ["user_id"], {
        name: "installment_groups_user_id_idx",
      });
    }

    const recurringIncomeIndexes =
      await queryInterface.showIndex("recurring_incomes");
    if (
      !recurringIncomeIndexes.some(
        (index) => index.name === "recurring_incomes_user_id_idx",
      )
    ) {
      await queryInterface.addIndex("recurring_incomes", ["user_id"], {
        name: "recurring_incomes_user_id_idx",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "recurring_expenses",
      "recurring_expenses_user_id_idx",
    );
    await queryInterface.removeIndex(
      "installment_groups",
      "installment_groups_user_id_idx",
    );
    await queryInterface.removeIndex(
      "recurring_incomes",
      "recurring_incomes_user_id_idx",
    );

    await queryInterface.changeColumn("recurring_expenses", "family_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("installment_groups", "family_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("recurring_incomes", "family_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.removeColumn("installment_groups", "user_id");
    await queryInterface.removeColumn("recurring_expenses", "user_id");
  },
};
