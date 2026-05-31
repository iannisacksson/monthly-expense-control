import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import { Category, CategoryType } from "../domain/entities/category.entity";
import { UserEntity } from "../domain/entities/user.entity";

type CategoryAttributes = Category & {
  userId?: string; // Armazenar user_id no banco, mas usar a associação com UserEntity na aplicação.
};
type CategoryCreationAttributes = Omit<CategoryAttributes, "id">;

export class CategoryModel
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  id!: string;
  user!: UserEntity; // Usar a entidade UserEntity apõs refatorar a User.
  userId?: string;
  name!: string;
  type!: CategoryType;

  // timestamps!
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data?: CategoryCreationAttributes, options?: BuildOptions) {
    super(data, options);
    this.userId = data?.userId ?? data?.user?.id; // Permitir criar a categoria usando userId diretamente ou através da associação com UserEntity.
  }

  toDomain(): Category {
    const { userId, ...rest } = this.get(); // Extrair userId para não expor diretamente, mas manter a associação com UserEntity na aplicação.
    return {
      id: this.id,
      user: { id: this.userId } as any, // Usar a entidade UserEntity apõs refatorar a User.
      name: this.name,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
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
      type: DataTypes.VIRTUAL, // Associação com UserEntity na aplicação, mas armazenar user_id no banco.
      get() {
        return { id: this.getDataValue("userId") };
      },
    }, // Associação com UserEntity na aplicação, mas armazenar user_id no banco.
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
