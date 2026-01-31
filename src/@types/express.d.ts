import { File } from 'multer';

declare namespace Express {
  export interface Request {
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      companyId: number;
      companyName: string;
      profilePicUrl: string;
      is2fa: boolean;
      isMaster: boolean;
      owner: boolean;
      version: number;
    }
    permissions: { list: any;};
    role:{ id?: number; name?: string;}

    files?: File;
  }
}
