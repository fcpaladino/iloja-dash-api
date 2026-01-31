
type IDeliveryTypeItem = {
  id?: number | null;
  companyId: number;
  typeId: number;
  name?: string;
  description?: string;
  hasShipping?: boolean;
  extraFee?: number;
  order?: number;
  active: boolean;
  enableAddress: boolean;
};

