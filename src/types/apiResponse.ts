export interface SuccessResponse<T> {
  data: T;
  message: string;
}

export interface ErrorResponse {
  statusCode?: number;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}