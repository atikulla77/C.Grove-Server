import { NextFunction, Request, Response } from "express";
export interface AuthRequest extends Request {
    admin?: {
        id: string;
        role: string;
    };
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map