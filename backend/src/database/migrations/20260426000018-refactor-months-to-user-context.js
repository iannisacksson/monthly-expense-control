"use strict";

async function hasConstraint(queryInterface, tableName, constraintName) {
  const [results] = await queryInterface.sequelize.query(
    `
      SELECT 1
      FROM pg_constraint
      WHERE conname = :constraintName
      LIMIT 1;
    `,
    {
      replacements: { constraintName },
    },
  );

  return results.length > 0;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const monthsTable = await queryInterface.describeTable("months");

    if (!monthsTable.user_id) {
      await queryInterface.addColumn("months", "user_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    await queryInterface.sequelize.query(`
      UPDATE months AS m
      SET user_id = single_member.user_id
      FROM (
        SELECT family_id, (ARRAY_AGG(user_id))[1] AS user_id
        FROM family_members
        GROUP BY family_id
        HAVING COUNT(*) = 1
      ) AS single_member
      WHERE m.family_id = single_member.family_id
        AND m.user_id IS NULL;
    `);

    await queryInterface.changeColumn("months", "family_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    if (
      !(await hasConstraint(
        queryInterface,
        "months",
        "months_user_id_year_month_uk",
      ))
    ) {
      await queryInterface.addConstraint("months", {
        fields: ["user_id", "year", "month"],
        type: "unique",
        name: "months_user_id_year_month_uk",
      });
    }

    const monthIndexes = await queryInterface.showIndex("months");
    if (
      !monthIndexes.some((index) => index.name === "months_user_year_month_idx")
    ) {
      await queryInterface.addIndex("months", ["user_id", "year", "month"], {
        name: "months_user_year_month_idx",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("months", "months_user_year_month_idx");
    await queryInterface.removeConstraint(
      "months",
      "months_user_id_year_month_uk",
    );

    await queryInterface.changeColumn("months", "family_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "families", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.removeColumn("months", "user_id");
  },
};
