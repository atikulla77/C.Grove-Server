import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
export declare const superAdminOnly: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=superAdmin.middleware.d.ts.map