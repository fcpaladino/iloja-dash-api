
type ICouponItem = {
  id?: number | null;
  companyId: number;
  code: string;
  type: string;
  value: number;
  minOrderValue: number;
  maxDiscount: number;
  startAt?: Date;
  endAt?: Date;
  usageLimit?: number;
  usageCount?: number;
  active: boolean;
};

