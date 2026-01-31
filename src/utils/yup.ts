import * as Yup from "yup";
import Company from "../models/Company";

Yup.addMethod(Yup.string, 'unique_validate', function (
  model: any,
  field: string,
  id?: string|number,
  message = 'Este valor já está em uso.'
) {
  return this.test(`unique-${field}`, message, async function (value) {
    if (!value) return true;

    const where: any = { [field]: value.trim() };
    if (id) {
      where.id = { $ne: id };
    }

    const exists = await model.count({ where });
    return exists === 0;
  });
});

Yup.addMethod(Yup.string, 'company_name', function (
  id?: string | number | null,
  message = 'Nome da empresa já está em uso.'
) {
  return this.test('company-name', message, async function (value) {
    if (!value) return true;

    const where: any = { name: value.trim() };
    if (id) {
      where.id = { $ne: id };
    }

    const exists = await Company.count({ where });
    return exists === 0;
  });
});

export const yup = Yup;
