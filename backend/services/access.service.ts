import { BadRequestError } from "../core/error.response";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import keyTokenService from "./keytoken.service";
import { createTokenPair, verifyJWT } from "./apiKey.service";
import { jwt } from "zod";

const prisma = new PrismaClient();

interface IUser {
  name?: string;
  email: string;
  password: string;
}

export class AccessService {
  static signUp = async ({ name, email, password }: IUser) => {
    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }
    // Check email exits
    const holderUser = await prisma.user.findUnique({
      where: { email },
    });
    if (holderUser) throw new BadRequestError("Email already exists");
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });
    if (newUser) {
      // create private key, public key
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "spki", // pkcs8
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      });

      const id = newUser.id;

      const tokens = await createTokenPair(
        { id, email },
        publicKey,
        privateKey
      );

      const publicKeyString = keyTokenService.createKeyToken({
        userId: newUser.id,
        publicKey,
        privateKey,
        refreshToken: tokens?.refreshToken,
      });

      if (!publicKeyString) {
        throw new BadRequestError("Key token error");
      }

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
        tokens,
      };
    }
    throw new BadRequestError("Error creating new User");
  };

  static login = async ({ email, password }: IUser) => {
    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }
    //1. Check email exits
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new BadRequestError("User not registered");
    //2. Check Password
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new BadRequestError("Password is incorrect");
    //3. Create token pair
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki", // pkcs8
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    const id = user.id;
    const tokens = await createTokenPair({ id, email }, publicKey, privateKey);
    await keyTokenService.createKeyToken({
      userId: user.id,
      publicKey,
      privateKey,
      refreshToken: tokens?.refreshToken,
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens,
    };
  };

  static logout = async (keyStore: any) => {
    await keyTokenService.removeKeyById(keyStore.id);
  };

  static handlerRefreshToken = async (refreshToken: string) => {
    const foundTokens = await keyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundTokens) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundTokens.privateKey
      );

      console.log("Decode:: ", userId, email);
      await keyTokenService.deleteKeyByUserId(userId);

      throw new BadRequestError("Something wrong happen. Please re-login");
    }

    const holderToken = await keyTokenService.findByRefreshToken(refreshToken);
    console.log("Holder token:: ", holderToken);
    if (!holderToken) throw new BadRequestError("Invalid refresh token");
    // Verify token
    const { id, email } = await verifyJWT(refreshToken, holderToken.privateKey);
    const userId = id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new BadRequestError("User not registered");
    // Create new token pair
    const tokens = await createTokenPair(
      { id: userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    await prisma.keys.update({
      where: { id: holderToken.id },
      data: {
        refreshToken: tokens?.refreshToken,
        refreshTokensUsed: {
          push: refreshToken,
        },
      },
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens,
    };
  };
}
