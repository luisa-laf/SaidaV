import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
interface IUser {
email: string;
id: string;
permission: string;
}
interface IPayload {
sub: string;
user: IUser;
}
export function getUserPermission(
request: Request,
response: Response,
next: NextFunction
) {
const authToken = request.headers.authorization;
if (!authToken) {
request.is_admin = false;
return next();
}
const [, token] = authToken.split(" ");
try {
const { user } = verify(token, process.env.JWT_SECRET) as IPayload;
request.is_admin = user.permission === "admin";
return next();
} catch (err) {
return response.status(401).json({ error: err });
}
}
