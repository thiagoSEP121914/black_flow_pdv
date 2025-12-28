import { AccessTokenPayload } from "../utils/jwt.util";

declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload;
        }
    }
}
