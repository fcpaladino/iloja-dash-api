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
    schedule: yup.mixed().nullable(),

    contactWhatsapp: yup.string().nullable(),
    contactEmail: yup.string().nullable(),
    address: yup.string().nullable(),
    siteTitle: yup.string().nullable(),
    siteSubTitle: yup.string().nullable(),
    colorPrimary: yup.string().nullable(),
    colorSecondary: yup.string().nullable(),
    themeMode: yup.string().oneOf(['light', 'dark']).nullable(),
    darkBackground: yup.string().nullable(),
    backgroundBannerStyle: yup.string().oneOf(['none', 'cart', 'nature', 'pets', 'fashion', 'tech', 'health', 'moveis', 'construcao', 'automotivo', 'beleza', 'esportes', 'papelaria', 'bebidas', 'joias', 'jardinagem']).nullable(),
    headerBackgroundColor: yup.string().nullable(),
    backgroundIconPattern: yup.string().oneOf(['none', 'mercado', 'sacolao', 'petshop', 'moda', 'eletronicos', 'farmacia', 'moveis', 'construcao', 'automotivo', 'beleza', 'esportes', 'papelaria', 'bebidas', 'joias', 'jardinagem']).nullable(),
    backgroundIconColor: yup.string().nullable(),
    backgroundIconOpacity: yup.number().min(0).max(1).nullable(),
    productCardType: yup.string().oneOf([
      'right_square',
      'left_square',
      'top_square',
      'compact',
      'detailed',
      'grid',
    ]).nullable(),
    categoryVisibleCount: yup.number().integer().min(1).max(50).nullable(),
    pointsEnabled: yup.boolean().nullable(),
    pointValue: yup.number().min(0).nullable(),
    pointCashValue: yup.number().min(0).nullable(),
    customerPortalEnabled: yup.boolean().nullable(),
    recommendedVisibleCount: yup.number().integer().min(1).max(50).nullable(),
    promotionVisibleCount: yup.number().integer().min(1).max(50).nullable(),
  })
}
