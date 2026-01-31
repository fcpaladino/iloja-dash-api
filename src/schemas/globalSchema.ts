import {yup} from "../utils/yup";

export const idParamSchema = () => {
  return yup.object({
    id: yup.number().integer().positive().required()
  })
}

export const idsParamSchema = () => {
  return yup.object({
    ids: yup
      .string()
      .required()
      .matches(/^(\d+)(;\d+)*$/, 'Formato inválido. Use números separados por ponto e vírgula.')
      .transform((value) => value.split(';').map(Number))
  })
}
