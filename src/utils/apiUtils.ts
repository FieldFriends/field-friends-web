import { AuthorizationSchemes } from "../../shared/constants"

// FriendDev: Standard Bearer header format: Bearer <token>
export const constructBearerHeader = (token: string): string => {
    return `${AuthorizationSchemes.Bearer} ${token}`;
}