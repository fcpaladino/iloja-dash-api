import {Op} from "sequelize";
import AppError from "../errors/AppError";

const ValidateField = async({model, field, value, id = null, companyId = null, messageError = 'Valor já existe'}): Promise<void> => {

  if (!value) return;

  const where: any = { [field]: value };
  if (id) {
    where.id = { [Op.ne]: Number(id) };
  }
  if (companyId) {
    where.companyId = { [Op.eq]: Number(companyId) };
  }

  const exists = await model.findOne({ where }, {attributes: ['id'] });

  if(!exists) return;

  if(exists?.id !== null) {
    throw new AppError('', 400, {[field]: messageError})
  }

}

export default ValidateField;
