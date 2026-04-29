"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "installment_groups",
      "starting_installment_number",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    );

    await queryInterface.addColumn("installment_groups", "category_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "categories", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("installment_groups", "subcategory_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "subcategories", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("installment_groups", "paid_by", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn(
      "installment_groups",
      "responsible_user_id",
      {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    );

    await queryInterface.addColumn("installment_groups", "start_month_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "months", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("installment_groups", "start_month_id");
    await queryInterface.removeColumn(
      "installment_groups",
      "responsible_user_id",
    );
    await queryInterface.removeColumn("installment_groups", "paid_by");
    await queryInterface.removeColumn("installment_groups", "subcategory_id");
    await queryInterface.removeColumn("installment_groups", "category_id");
    await queryInterface.removeColumn(
      "installment_groups",
      "starting_installment_number",
    );
  },
};
