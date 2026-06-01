import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  Subcategory,
  SubcategoryEntity,
} from "../domain/entities/subcategory.entity";
import { Category, CategoryEntity } from "../domain/entities/category.entity";

type SubcategoryAttributes = Subcategory & { categoryId?: string };
type SubcategoryCreationAttributes = Omit<
  SubcategoryAttributes,
  "id" | "validateName" | "normalizeName"
>;

export class SubcategoryModel
  extends Model<SubcategoryAttributes, SubcategoryCreationAttributes>
  implements SubcategoryAttributes
{
  id!: string;
  categoryId?: string;
  category!: Category;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data?: SubcategoryCreationAttributes, options?: BuildOptions) {
    super(data, options);
    this.categoryId = data?.categoryId ?? data?.category?.id;
  }

  toDomain(): Subcategory {
    const { categoryId, ...rest } = this.get();
    return new SubcategoryEntity({
      ...rest,
      category: new CategoryEntity({ id: categoryId }),
    });
  }

  validateName(): string {
    return this.toDomain().validateName();
  }

  normalizeName(): string {
    return this.toDomain().normalizeName();
  }
}

SubcategoryModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    category: {
      type: DataTypes.VIRTUAL,
      get() {
        return new CategoryEntity({ id: this.getDataValue("categoryId") });
      },
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    validateName: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.validateName;
      },
    },
    normalizeName: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.normalizeName;
      },
    },
  },
  {
    sequelize,
    tableName: "subcategories",
    underscored: true,
    timestamps: true,
  },
);
