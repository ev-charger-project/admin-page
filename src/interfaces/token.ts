export type GetAccessToken = () => Promise<string> | string;

export interface BaseTokenClaims {
    ver: string;
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    nonce: string;
    iat: number;
    tfp: string;
    nbf: number;
}
export interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
}

export interface RefreshAccessTokenParams {
    refreshToken: string;
}
