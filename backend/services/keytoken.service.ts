import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
interface IKeyToken {
  userId: string;
  publicKey: string;
  privateKey: string;
  refreshToken?: string;
}

export class keyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: IKeyToken) => {
    const tokens = await prisma.keys.upsert({
      where: { userId },
      update: { publicKey, privateKey, refreshToken, refreshTokensUsed: [] },
      create: {
        userId,
        publicKey,
        privateKey,
        refreshToken,
        refreshTokensUsed: [],
      },
    });
    return tokens;
  };

  static removeKeyById = async (id: string) => {
    return await prisma.keys.delete({
      where: { id },
    });
  };

  static findByUserId = async (userId: string) => {
    return await prisma.keys.findUnique({
      where: { userId },
    });
  };

  static findByRefreshTokenUsed = async (refreshToken: string) => {
    return await prisma.keys.findFirst({
      where: { refreshTokensUsed: { has: refreshToken } },
    });
  };

  static findByRefreshToken = async (refreshToken: string) => {
    return await prisma.keys.findFirst({
      where: { refreshToken },
    });
  };

  static deleteKeyByUserId = async (id: string) => {
    return await prisma.keys.deleteMany({
      where: { userId: id },
    });
  };
}

export default keyTokenService;
