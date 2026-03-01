import type { LoginRequest } from "#shared/schemas/loginSchema";
import { makeApiRequest } from "../api";
import { HttpMethods } from "#shared/constants";

export async function login(email: string): Promise<void> {
    const body: LoginRequest = { email: email };

    await makeApiRequest('/api/login', {
        method: HttpMethods.Post,
        body: body,
        requireAuth: false
    });
}