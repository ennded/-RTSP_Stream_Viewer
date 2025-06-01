import { io, Socket } from 'socket.io-client';
import { StreamError, VideoFrame } from '../types/stream';

let socket: Socket;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }
  return socket;
};

export const joinStreamRoom = (streamId: string): void => {
  if (socket) {
    socket.emit('join', streamId);
  }
};

export const leaveStreamRoom = (streamId: string): void => {
  if (socket) {
    socket.emit('leave', streamId);
  }
};

export const onStreamError = (callback: (error: StreamError) => void): void => {
  if (socket) {
    socket.on('stream-error', callback);
  }
};

export const onVideoFrame = (callback: (frame: VideoFrame) => void): void => {
  if (socket) {
    socket.on('video-frame', callback);
  }
};

export const removeAllListeners = (): void => {
  if (socket) {
    socket.removeAllListeners();
  }
};