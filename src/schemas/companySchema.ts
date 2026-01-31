import {yup} from "../utils/yup";

export const querySchema = () => {
  return yup.object({
    page: yup.number().integer().positive().required()
  })
}


export const storeSchema = () => {
  return yup.object({
    name: yup.string().required(),
    email: yup.string().required(),
    phone: yup.string(),
    active: yup.boolean(),
    subdomain: yup.string(),
  })
}

export const updateSchema = (id:string|null = null) => {
  return yup.object({
    name: yup.string(),
    email: yup.string(),
    phone: yup.string(),
    active: yup.boolean(),
    subdomain: yup.string(),

    contactWhatsapp: yup.string().nullable(),
    contactEmail: yup.string().nullable(),
    address: yup.string().nullable(),
    siteTitle: yup.string().nullable(),
    siteSubTitle: yup.string().nullable(),
    colorPrimary: yup.string().nullable(),
    colorSecondary: yup.string().nullable(),
  })
}
