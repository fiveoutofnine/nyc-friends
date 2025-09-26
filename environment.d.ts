declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Auth
      BETTER_AUTH_URL: string;
      BETTER_AUTH_SECRET: string;
      AUTH_GOOGLE_ID: string;
      AUTH_GOOGLE_SECRET: string;
      // Database
      DATABASE_URL: string;
    }
  }
}

export {};
