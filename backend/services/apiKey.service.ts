import { asyncHandler } from "helpers/handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import keyTokenService from "./keytoken.service";

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

export const createTokenPair = async (
  payload: any,
  publicKey: any,
  privateKey: any
) => {
  try {
    // access token
    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
    // refresh token
    const refreshToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });
    jwt.verify(accessToken, publicKey, (err: any, decode: any) => {
      if (err) {
        console.log(`[ERROR]::`, err);
      } else {
        console.log(`Decode::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
  }
};

export const authentication = asyncHandler(async (req, res, next) => {
  console.log("Authentication here");
  /**
   * 1 - Check userId missing
   * 2 - Get accessToken
   * 3 - Verify token
   * 4 - Check user in dbs
   * 5 - Check keyStore with userId
   * 6 - OK all pass -> next()
   */
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId || Array.isArray(userId))
    throw new Error("Invalid Request userId");
  const keyStore = await keyTokenService.findByUserId(userId);
  if (!keyStore) throw new Error("Invalid Request keyStore");
  let accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new Error("Invalid Request accessToken");
  try {
    const publicKey = keyStore.publicKey;
    if (typeof accessToken !== "string") {
      throw new Error("Invalid accessToken format");
    }
    if (typeof accessToken === "string" && accessToken.startsWith("Bearer ")) {
      accessToken = accessToken.slice(7);
    }
    const decode = jwt.verify(accessToken, publicKey);
    if (typeof decode !== "object" || decode === null || !("id" in decode)) {
      throw new Error("Invalid token payload");
    }
    if (decode.id !== userId) {
      throw new Error("Invalid user");
    }
    (req as any).keyStore = keyStore;
    return next();
  } catch (err) {
    throw err;
  }
});

export const verifyJWT = async (
  token: string,
  key: string
): Promise<TokenPayload> => {
  try {
    const decoded = jwt.verify(token, key) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
