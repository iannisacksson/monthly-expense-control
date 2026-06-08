import {
  IsDate,
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import {
  Category,
  CategoryType,
} from "../../../../domain/entities/category.entity";

export interface ICategoryResponse {
  id: string;
  name: string;
  type: CategoryType;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export class CategoryResponse implements ICategoryResponse {
  @IsUUID()
  id: string;

  @IsString()
  @MinLength(2, {
    message: "Category name must be between 2 and 100 characters",
  })
  @MaxLength(100, {
    message: "Category name must be between 2 and 100 characters",
  })
  name: string;

  @IsEnum(CategoryType, { message: "Invalid category type" })
  type: CategoryType;

  @IsUUID()
  user_id: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  constructor(data: Category) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.user_id = data.user.id;
    this.created_at = data.createdAt;
    this.updated_at = data.updatedAt;
  }
}
