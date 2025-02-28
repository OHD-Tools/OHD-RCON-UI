import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import type {
  CreationOptional,
  HasManyCreateAssociationMixin,
  HasManyHasAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { IdUtil } from '~utils/IdUtil';
import { UserAuth } from '~v1/auth/auth_user.model';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @Default(IdUtil.generateId)
  @Column({ type: DataType.STRING(IdUtil.idLength) })
  declare readonly id: CreationOptional<string>;

  @Default('Unverified User')
  @Column({ type: DataType.STRING(32) })
  declare displayName: CreationOptional<string>;

  @Default(() => new Date(Date.now()))
  @Column({ type: DataType.DATE() })
  declare last_login: CreationOptional<Date>;

  @HasMany(() => UserAuth, `user_id`)
  declare Auth?: NonAttribute<Awaited<UserAuth[]>>;
  declare createAuth: HasManyCreateAssociationMixin<Awaited<UserAuth>>;
  declare hasAuth: HasManyHasAssociationMixin<Awaited<UserAuth>, string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}
