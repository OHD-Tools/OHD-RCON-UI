import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import type {
  BelongsToGetAssociationMixin,
  CreationOptional,
  ForeignKey as ForeignKeyType,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { IdUtil } from '~utils/IdUtil';
import { User } from '~v1/users/user.model';

@Table({ tableName: 'user_auth', timestamps: true })
export class UserAuth extends Model<
  InferAttributes<UserAuth>,
  InferCreationAttributes<UserAuth>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER({ unsigned: true }) })
  declare id: CreationOptional<ForeignKeyType<number>>;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING(IdUtil.idLength) })
  declare user_id: ForeignKeyType<string>;

  @Column({ type: DataType.ENUM('DISCORD', 'GOOGLE', 'STEAM', 'CREDENTIALS') })
  declare type: 'DISCORD' | 'GOOGLE' | 'STEAM' | 'CREDENTIALS';

  @Column({ type: DataType.STRING(32) })
  declare identifier: string;

  @Column({ type: DataType.STRING(32) })
  declare password?: CreationOptional<string>;

  @BelongsTo(() => User)
  declare User?: NonAttribute<Awaited<User>>;
  declare getUser: BelongsToGetAssociationMixin<Awaited<User>>;
}
