"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM recurring_expenses WHERE user_id IS NULL) THEN
          RAISE EXCEPTION 'Cannot make recurring_expenses.user_id NOT NULL while legacy rows exist';
        END IF;

        IF EXISTS (SELECT 1 FROM installment_groups WHERE user_id IS NULL) THEN
          RAISE EXCEPTION 'Cannot make installment_groups.user_id NOT NULL while legacy rows exist';
        END IF;
      END
      $$;
    `);

    await queryInterface.changeColumn("recurring_expenses", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("installment_groups", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("recurring_expenses", "user_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("installment_groups", "user_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
};
