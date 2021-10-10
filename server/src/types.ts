import type { IncomingMessage } from 'http';
import type { SessionData } from 'express-session';
import type { Socket } from 'socket.io';
import 'expresss-session';

declare module 'express-session' {
    interface SessionData {
        userId: number;
    }
};

interface SessionIncomingMessage extends IncomingMessage {
    session: SessionData
};

export interface SessionSocket extends Socket {
    request: SessionIncomingMessage
};