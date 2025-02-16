export type ConfigItem = {
  type: "TEXT" | "IDENT";
  literal: string;
};

export type ConfigError = {
  type: "error";
  error: {
    message: string;
    suggestion?: {
      start: number;
      end: number;
      replacement: string;
      description: string;
    };
  };
};

export type ConfigSuccess = {
  type: "success";
  config: ConfigItem[];
};
