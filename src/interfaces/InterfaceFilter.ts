
type IFilterItem = {
  id?: number | null;
  companyId: number;
  name: string;
  slug: string;
  order?: number;
  active: boolean;
  items?: any[];
};

