import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";

import { Config } from "@/server/config/schema";
import { UserService } from "@/server/user/user.service";

import { Payload } from "../utils/payload";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly userService: UserService,
  ) {
    const extractors = [(request: Request) => request.cookies.Refresh];

    super({
      secretOrKey: configService.getOrThrow<string>("REFRESH_TOKEN_SECRET"),
      jwtFromRequest: ExtractJwt.fromExtractors(extractors),
      ignoreExpiration: false,
    } as StrategyOptions);
  }

  async validate(payload: Payload) {
    const user = await this.userService.findOneById(payload.id);

    if (!user.secrets?.refreshToken) throw new ForbiddenException();

    if (!user.twoFactorEnabled) return user;

    if (payload.isTwoFactorAuth) return user;
  }
}
