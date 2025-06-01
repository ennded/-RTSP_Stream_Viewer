export interface Stream {
  _id: string;
  url: string;
  createdAt: string;
  currentFrame?: string;
  error?: string;
}

export interface AddStreamResponse {
  success: boolean;
  stream: Stream;
  message?: string;
}

export interface DeleteStreamResponse {
  success: boolean;
  message?: string;
}

export interface StreamError {
  streamId: string;
  message: string;
}

export interface VideoFrame {
  streamId: string;
  frame: string;
}