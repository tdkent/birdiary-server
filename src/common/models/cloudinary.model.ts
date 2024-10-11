export type CloudinaryResponse = {
  resources: [
    {
      asset_id: string;
      public_id: string;
      format: string;
      version: number;
      resource_type: string;
      type: string;
      created_at: string;
      bytes: number;
      width: number;
      height: number;
      asset_folder: string;
      display_name: string;
      url: string;
      secure_url: string;
    },
  ];
  total_count: number;
  next_cursor: null;
  rate_limit_allowed: number;
  rate_limit_reset_at: Date;
  rate_limit_remaining: number;
};

export type CloudinaryError = {
  request_options: object;
  query_params: string;
  error: {
    message: string;
    http_code: number;
  };
};
