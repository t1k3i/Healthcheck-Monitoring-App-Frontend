import { Role } from "./role";

export interface User {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    role: Role;
    authdata?: string;
}