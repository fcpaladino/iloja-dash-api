
type IProductItem = {
  id?: number | null;
  companyId: number;
  categoryId: number;
  brandId: number;
  groupId: number|null;
  subGroupId: number|null;
  name: string;
  title?: string;
  sku?: string;
  ref?: string;
  description?: string;
  text?: string;
  slug?: string;
  image?: string;
  price?: number;
  pricePromotional?: number;
  availability?: boolean;
  point?: number;
  isNew?: boolean;
  isPromotional?: boolean;
  isPopular?: boolean;
  active: boolean;
};

type IProductListItem = {
  id?: number | null;
  companyId: number;
  name: string;
  active: boolean;
};
