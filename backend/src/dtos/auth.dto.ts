import { UserResponseType } from "./user.dto";

export interface LoginResponseType {
  user: UserResponseType; 
  token: string;
}