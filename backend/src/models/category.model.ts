import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  Category,
  CategoryEntity,
  CategoryType,
} from "../domain/entities/category.entity";
import { User, UserEntity } from "../domain/entities/user.entity";

type CategoryAttributes = Category & {
  userId?: string;
};
type CategoryCreationAttributes = Omit<CategoryAttributes, "id">;

export class CategoryModel
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  id!: string;
  user!: User;
  userId?: string;
  name!: string;
  type!: CategoryType;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data?: CategoryCreationAttributes, options?: BuildOptions) {
    super(data, options);
    this.userId = data?.userId ?? data?.user?.id; // Permitir criar a categoria usando userId diretamente ou através da associação com UserEntity.
  }

  toDomain(): Category {
    const { userId, ...rest } = this.get();
    return new CategoryEntity({
      ...rest,
      user: new UserEntity({ id: this.userId }),
    });
  }
}

CategoryModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    user: {
      type: DataTypes.VIRTUAL,
      get() {
        return new UserEntity({ id: this.getDataValue("userId") });
      },
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
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
  },
  {
    sequelize,
    modelName: "categories",
    underscored: true,
  },
);
