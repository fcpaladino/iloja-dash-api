import { asyncLocalStorage } from "../middleware/requestContext";
import { verify } from "jsonwebtoken";
import authConfig from "../config/auth";

export interface userDataError {
    companyId: number | null;
    companyName: string;
    userId: string;
    userEmail: string;
}



export class UserRequest {

    static get(): userDataError;

    static get(): userDataError {

        // Obtém a requisição a partir do AsyncLocalStorage
        const store = asyncLocalStorage.getStore();
        const req = store?.req;
        const tokenHeader = req?.headers?.authorization || '';
        const [, token] = tokenHeader.split(" ");

        let decodedToken: any = {};

        try {
            const decoded = verify(token, authConfig.secret);
            //@ts-ignore
            decodedToken = { ...decoded };
        } catch (error) {

        }

        const userData: userDataError = {
            //@ts-ignore
            companyId: decodedToken?.companyId || '',
            //@ts-ignore
            companyName: decodedToken?.companyName || '',
            //@ts-ignore
            userId: decodedToken?.id || '',
            //@ts-ignore
            userEmail: decodedToken?.email || '',
        };

        return userData;

    }
}
