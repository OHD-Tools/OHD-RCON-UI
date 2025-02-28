import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  type ForeignKey as ForeignKeyType,
} from 'sequelize';
import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiPermission } from '~/auth/ApiPermission';
import { IdUtil } from '~utils/IdUtil';

@Table({ tableName: 'api_tokens', timestamps: true })
export class ApiToken extends Model<
  InferAttributes<ApiToken>,
  InferCreationAttributes<ApiToken>
> {
  @PrimaryKey
  @Default(IdUtil.generateId)
  @Column(DataType.STRING(IdUtil.idLength))
  declare id: CreationOptional<string>;

  @Column(DataType.STRING(IdUtil.idLength))
  declare user_id: ForeignKeyType<string>;

  @PrimaryKey
  @Column(DataType.STRING(IdUtil.idLength))
  declare token_id: string;

  @Column(DataType.ENUM('access', 'refresh', 'api'))
  declare type: 'access' | 'refresh' | 'api';

  @Default('USER_TOKEN')
  @Column(DataType.STRING(32))
  declare name: CreationOptional<string>;

  @Default([])
  @Column(DataType.JSON)
  declare roles: CreationOptional<ApiPermission[]>;

  @Column(DataType.DATE)
  declare expiresAt: CreationOptional<Date>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
