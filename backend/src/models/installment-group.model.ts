import { BuildOptions, DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import {
  InstallmentGroup,
  InstallmentGroupEntity,
} from "../domain/entities/installment-group.entity";
import { Category, CategoryEntity } from "../domain/entities/category.entity";
import { Month, MonthEntity } from "../domain/entities/month.entity";
import {
  Subcategory,
  SubcategoryEntity,
} from "../domain/entities/subcategory.entity";
import { User, UserEntity } from "../domain/entities/user.entity";

type InstallmentGroupAttributes = Omit<
  InstallmentGroup,
  "paidBy" | "responsibleUser"
> & {
  userId?: string;
  categoryId?: string;
  subcategoryId?: string;
  paidById?: string;
  paidBy?: User;
  responsibleUserId?: string;
  responsibleUser?: User;
  startMonthId?: string;
};
type InstallmentGroupCreationAttributes = Omit<
  InstallmentGroupAttributes,
  "id"
>;

export class InstallmentGroupModel
  extends Model<InstallmentGroupAttributes, InstallmentGroupCreationAttributes>
  implements InstallmentGroupAttributes
{
  id!: string;
  userId?: string;
  user!: User;
  description!: string;
  totalValue!: number;
  installments!: number;
  startingInstallmentNumber!: number;
  categoryId?: string;
  category!: Category;
  subcategoryId?: string;
  subcategory?: Subcategory;
  paidById?: string;
  paidBy?: User;
  responsibleUserId?: string;
  responsibleUser?: User;
  startMonthId?: string;
  startMonth: Month;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(
    data?: InstallmentGroupCreationAttributes,
    options?: BuildOptions,
  ) {
    super(data, options);
    this.userId = data?.userId ?? data?.user?.id;
    this.categoryId = data?.categoryId ?? data?.category?.id;
    this.subcategoryId = data?.subcategoryId ?? data?.subcategory?.id;
    this.paidById = data?.paidById ?? data?.paidBy?.id;
    this.responsibleUserId =
      data?.responsibleUserId ?? data?.responsibleUser?.id;
    this.startMonthId = data?.startMonthId ?? data?.startMonth?.id;
  }

  toDomain(): InstallmentGroup {
    const {
      userId,
      categoryId,
      subcategoryId,
      paidById,
      responsibleUserId,
      startMonthId,
      ...rest
    } = this.get();
    return new InstallmentGroupEntity({
      ...rest,
      user: new UserEntity({ id: userId }),
      category: new CategoryEntity({ id: categoryId }),
      subcategory: subcategoryId
        ? new SubcategoryEntity({ id: subcategoryId })
        : undefined,
      paidBy: paidById ? new UserEntity({ id: paidById }) : undefined,
      responsibleUser: responsibleUserId
        ? new UserEntity({ id: responsibleUserId })
        : undefined,
      startMonth: startMonthId
        ? new MonthEntity({ id: startMonthId })
        : undefined,
    });
  }
}

InstallmentGroupModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user: {
      type: DataTypes.VIRTUAL,
      get() {
        return new UserEntity({ id: this.getDataValue("userId") });
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    totalValue: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    installments: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startingInstallmentNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    category: {
      type: DataTypes.VIRTUAL,
      get() {
        return new CategoryEntity({ id: this.getDataValue("categoryId") });
      },
    },
    subcategoryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    subcategory: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("subcategoryId");
        return id ? new SubcategoryEntity({ id }) : undefined;
      },
    },
    paidById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "paid_by",
    },
    paidBy: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("paidById");
        return id ? new UserEntity({ id }) : undefined;
      },
    },
    responsibleUserId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    responsibleUser: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("responsibleUserId");
        return id ? new UserEntity({ id }) : undefined;
      },
    },
    startMonthId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    startMonth: {
      type: DataTypes.VIRTUAL,
      get() {
        const id = this.getDataValue("startMonthId");
        return id ? new MonthEntity({ id }) : undefined;
      },
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
    tableName: "installment_groups",
    underscored: true,
    timestamps: true,
    updatedAt: false,
  },
);
