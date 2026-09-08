
type ICategoryItem = {
  id?: number | null;
  companyId: number;
  name: string;
  slug: string;
  order: number;
  active: boolean;
  productCardType?: string | null;
  visibleCount?: number | null;
};

type ICategoryListItem = {
  id?: number | null;
  companyId: number;
  name: string;
  order: number;
  active: boolean;
  productCardType?: string | null;
  visibleCount?: number | null;
};
