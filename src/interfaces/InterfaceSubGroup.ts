
type ISubGroupItem = {
  id?: number | null;
  companyId: number;
  name: string;
  slug?: string;
  description: string;
  color: string;
  icon: string;
  groupId: number;
  active: boolean;
};

type ISubGroupListItem = {
  id?: number | null;
  companyId: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  groupId: number;
  active: boolean;
};
