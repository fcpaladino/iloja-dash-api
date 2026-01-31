import { StringSchema } from 'yup';

declare module 'yup' {
  interface StringSchema {
    company_name(id?: string | number | null, message?: string): StringSchema;
    unique_validate(model: any, field: string, id?: string|number, message?: string): StringSchema;
  }
}
