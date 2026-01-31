import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull, BeforeCreate,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

@Table({tableName: 'UserSession'})
class UserSession extends Model<UserSession> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  companyId: number;

  @Column
  userId: number;

  @AllowNull(false)
  @Column
  uuid: string;

  @AllowNull(false)
  @Column
  sessionId: string;

  @AllowNull
  @Column
  deviceInfo: string;

  @AllowNull
  @Column
  ipAddress: string;

  @AllowNull
  @Column
  userAgent: string;

  @AllowNull
  @Column
  isCurrent: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BeforeCreate
  static setUUID(user: UserSession) {
    user.uuid = uuidv4();
  }
}

export default UserSession;
