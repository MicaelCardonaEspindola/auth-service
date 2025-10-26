import { Injectable } from '@nestjs/common';
import { DEFAULT_CONFIG } from './config.default';
import * as configInterface from './config.interface';


/**
 * Provides a means to access the application configuration.
 */
@Injectable()
export class ConfigService {
  private config: configInterface.ConfigData;

  constructor(data: configInterface.ConfigData = DEFAULT_CONFIG) {
    this.config = data;
  }

  /**
   * Loads the config from environment variables.
   */
  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): configInterface.ConfigData {
    return {
      env: env.NODE_ENV || DEFAULT_CONFIG.env,
      port: parseInt(env.PORT!, 10),
      db: this.parseDbConfigFromEnv(env, DEFAULT_CONFIG.db),
      logLevel: env.LOG_LEVEL || DEFAULT_CONFIG.logLevel,
      debug: env.DEBUG || 'qapi:*',
      newRelicKey: env.NEW_RELIC_KEY || DEFAULT_CONFIG.newRelicKey,
      sendGrid: this.parseSendGridConfigFromEnv(env),
      auth: this.parseAuthConfigFromEnv(env)
    };
  }

  private parseAuthConfigFromEnv(env: NodeJS.ProcessEnv): configInterface.AuthConfig {
    return {
      jwtSecret: env.JWT_SECRET || '',
      expireIn: Number(env.JWT_EXPIRE_IN) || 268000
    };
  }
  private parseSendGridConfigFromEnv(env: NodeJS.ProcessEnv): configInterface.SendGridConfig {
    return {
      apiKey: env.SENDGRID_API_KEY || '',
      verifiedEmail: env.SENDGRID_VERIFIED_SENDER_EMAIL || ''
    };
  }


  private parseDbConfigFromEnv(env: NodeJS.ProcessEnv, defaultConfig: Readonly<configInterface.ConfigDBData>): configInterface.ConfigDBData {
    return {
      url: env.DATABASE_URL || defaultConfig.url,
    };
  }


  /**
   * Retrieves the config.
   * @returns immutable view of the config data
   */
  public get(): Readonly<configInterface.ConfigData> {
    return this.config;
  }
}
