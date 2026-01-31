
type IBrandItem = {
  id?: number | null;
  companyId: number;
  name: string;
  slug: string;
  order: number;
  active: boolean;
};

type IBrandListItem = {
  id?: number | null;
  companyId: number;
  name: string;
  order: number;
  active: boolean;
};
