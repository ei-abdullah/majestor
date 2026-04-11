import {AuthUser} from "./auth";

export type UserDetails = AuthUser;

export interface PersonalDetailsBody {
    personalEmail?: string,
    phone?: string,
}
