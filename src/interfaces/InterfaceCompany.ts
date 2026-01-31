
type ICompanyItem = {
  id?: number | null;
  name: string;
  active: boolean;
  planId?: number|null;
  phone?: string|null;
  email?: string|null;
  document?: string|null;
  signature?: string|null;
  dueDate?: Date;
  amount?: number;
  password?: string;
  subdomain?: string;
  logotipo?: string;
  schedule?: string;
  contactWhatsapp?: string;
  contactEmail?: string;
  address?: string;
  siteTitle?: string;
  siteSubTitle?: string;
  colorPrimary?: string;
  colorSecondary?: string;
  chavePix?: string;
  isBtnWhatsapp?: boolean;
  isOrder?: boolean;
  isFrete?: boolean;
};

type ICompanyListItem = {
  id?: number;
  name: string;
  planId?: number;
  active: boolean;
  phone?: string;
  email?: string;
  document?: string;
  signature?: string;
  dueDate?: Date;
  amount?: number;
};
