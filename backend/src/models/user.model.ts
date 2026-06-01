import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import { User, UserEntity } from "../domain/entities/user.entity";

type UserAttributes = User & { passwordHash?: string };
type UserCreationAttributes = Omit<
  UserAttributes,
  "id" | "validateName" | "validateEmail" | "validatePasswordStrength"
>;

export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  id!: string;
  name!: string;
  email!: string;
  passwordHash!: string;
  createdAt!: Date;
  updatedAt!: Date;

  toDomain(): User {
    return new UserEntity({
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  validateName(name: string) {
    this.toDomain().validateName(name);
  }

  validateEmail(email: string) {
    this.toDomain().validateEmail(email);
  }

  validatePasswordStrength(password: string) {
    this.toDomain().validatePasswordStrength(password);
  }
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    passwordHash: {
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
    validateEmail: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.validateEmail;
      },
    },
    validatePasswordStrength: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.validatePasswordStrength;
      },
    },
  },
  {
    sequelize,
    tableName: "users",
    underscored: true,
    timestamps: true,
  },
);
