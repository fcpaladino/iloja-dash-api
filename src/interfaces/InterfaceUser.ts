
type IUserItem = {
  id?: number | null;
  companyId: number;
  roleId?: number;
  firstname?: string;
  lastname?: string;
  name: string;
  username?: string|null;
  email?: string|null;
  emailVerifiedAt?: Date;
  emailCode?: string|null;
  phone?: string|null;
  phoneVerifiedAt?: Date;
  phoneCode?: string|null;
  token2fa?: string|null;
  is2fa?: boolean;
  profilePicUrl?: string|null;
  loggedIn?: Date;
  password?: string;
  owner: boolean;
  active: boolean;
};

type IUserListItem = {
  id?: number | null;
  companyId: number;
  roleId?: number;
  name: string;
  username?: string|null;
  email?: string|null;
  emailVerifiedAt?: Date;
  phone?: string|null;
  phoneVerifiedAt?: Date;
  is2fa?: boolean;
  profilePicUrl?: string|null;
  loggedIn?: Date;
  owner: boolean;
  active: boolean;
};

type IUserChangePassword = {
  password: string;
};
