/// <reference types="react-scripts" />
/// <reference types="react-dom/experimental" />
/// <reference types="react/experimental" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    REACT_APP_COUCHERS_ENV: "prod" | "preview" | "dev";
    REACT_APP_API_BASE_URL: string;
    REACT_APP_IS_POST_BETA_ENABLED: boolean;
    REACT_APP_VERSION: string;
    REACT_APP_IS_COMMUNITIES_ENABLED: string;
  }
}
