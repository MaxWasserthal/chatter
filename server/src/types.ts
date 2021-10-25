import 'express-session';

// add userId to session object from express-session
declare module 'express-session' {
    interface SessionData {
        userId: number;
    }
};