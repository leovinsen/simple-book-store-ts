export type JwtPayload = {
    sub: number; // subject / userId
    email: string; // user email
    created_at: Date; // token creation time
};
