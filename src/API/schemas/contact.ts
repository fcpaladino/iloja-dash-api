import {yup} from "../../utils/yup";

export const idParamSchema = (id:string|null = null) => {
  return yup.object({
    id: yup.number().integer().positive().required()
  })
}

export const querySchema = () => {
  return yup.object({
    page: yup.number().integer().positive().nullable(),
    search: yup.string().nullable()
  })
}

