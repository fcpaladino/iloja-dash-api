import 'sequelize';

declare module 'sequelize' {
  interface QueryOptions {
    UseCache?: boolean;
    companyId?: number;
  }
}
