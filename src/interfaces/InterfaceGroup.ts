
type IGroupItem = {
  id?: number | null;
  companyId: number;
  name: string;
  slug?: string;
  description: string;
  color: string;
  icon: string;
  active: boolean;
};

type IGroupListItem = {
  id?: number | null;
  companyId: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  active: boolean;
};
