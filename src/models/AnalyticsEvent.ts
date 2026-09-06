import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { BaseModel } from "../database/baseModelSequelize";

@Table({ tableName: "AnalyticsEvent" })
class AnalyticsEvent extends BaseModel<AnalyticsEvent> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  companyId: number;

  @AllowNull(false)
  @Column
  event: string;

  @AllowNull
  @Column
  productId: string;

  @AllowNull
  @Column
  productName: string;

  @AllowNull
  @Column
  categoryName: string;

  @AllowNull
  @Column
  quantity: number;

  @AllowNull
  @Column
  value: number;

  @AllowNull
  @Column
  sessionId: string;

  @AllowNull
  @Column(DataType.JSON)
  metadata: Record<string, unknown>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default AnalyticsEvent;
