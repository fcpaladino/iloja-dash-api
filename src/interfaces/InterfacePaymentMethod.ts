
type IPaymentMethodItem = {
  id?: number | null;
  companyId: number;
  name: string;
  slug: string;
  isDefault?: boolean;
  order?: number;
  active: boolean;
  enabledChange: boolean;
  pixValue: string;
};

