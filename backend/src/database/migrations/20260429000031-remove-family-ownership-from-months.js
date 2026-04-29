"use strict";

async function hasIndex(queryInterface, tableName, indexName) {
  const indexes = await queryInterface.showIndex(tableName);
  return indexes.some((index) => index.name === indexName);
}

async function hasConstraint(queryInterface, constraintName) {
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

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM months WHERE user_id IS NULL) THEN
          RAISE EXCEPTION 'Cannot remove family ownership from months while user_id is null';
        END IF;
      END
      $$;
    `);

    if (
      await hasIndex(queryInterface, "months", "months_family_year_month_idx")
    ) {
      await queryInterface.removeIndex(
        "months",
        "months_family_year_month_idx",
      );
    }

    if (await hasConstraint(queryInterface, "months_family_id_year_month_uk")) {
      await queryInterface.removeConstraint(
        "months",
        "months_family_id_year_month_uk",
      );
    } else if (
      await hasIndex(queryInterface, "months", "months_family_id_year_month_uk")
    ) {
      await queryInterface.removeIndex(
        "months",
        "months_family_id_year_month_uk",
      );
    }

    await queryInterface.changeColumn("months", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    if (monthsTable.family_id) {
      await queryInterface.removeColumn("months", "family_id");
    }
  },

  async down(queryInterface, Sequelize) {
    const monthsTable = await queryInterface.describeTable("months");

    if (!monthsTable.family_id) {
      await queryInterface.addColumn("months", "family_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "families", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    await queryInterface.changeColumn("months", "user_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    if (
      !(await hasConstraint(queryInterface, "months_family_id_year_month_uk"))
    ) {
      await queryInterface.addConstraint("months", {
        fields: ["family_id", "year", "month"],
        type: "unique",
        name: "months_family_id_year_month_uk",
      });
    }

    if (
      !(await hasIndex(
        queryInterface,
        "months",
        "months_family_year_month_idx",
      ))
    ) {
      await queryInterface.addIndex("months", ["family_id", "year", "month"], {
        name: "months_family_year_month_idx",
      });
    }
  },
};
