import "dotenv-safe/config";
import "reflect-metadata";
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import cors from 'cors';
import { Message } from './entities/Message';
import { Reaction } from './entities/Reaction';
import { Role } from './entities/Role';
import { Room } from './entities/Room';
import { Member } from './entities/Member';
import { MemberRoom } from "./entities/MemberRoom";
import path from 'path';
import { createConnection } from 'typeorm';
import { register } from "./utils/register";
import { login } from "./utils/login";
import { COOKIE_NAME } from "./constants";
import { me } from "./utils/me";
import { logout } from "./utils/logout";
import { RoomRouter } from "./routes/rooms";
import { RoomInfoRouter } from "./routes/room-info";
import { MessageRouter } from "./routes/messages";
import { ReactionRouter } from "./routes/reactions";
import { ResponseRouter } from "./routes/responses";
import { MembersRouter } from "./routes/members";

const main = async () => {

    const app = express();
    const cookieParser = require('cookie-parser')();

    const RedisStore = require('connect-redis')(session);
    const redis = new Redis(6379, 'localhost');
    const pool = await createConnection({
        type: "postgres",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as any),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        logging: true,
        entities: [Member, Message, Reaction, Role, Room, MemberRoom],
        migrations: [path.join(__dirname, "./migrations/*")]
    })

    app.use(cors({
        origin: process.env.ORIGIN_URL,
        credentials: true,
    }));

    app.options('*', cors)

    app.use(express.json());

    const sessionMiddleware = session({
        name: COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
        },
        secret: process.env.APP_SECRET || "",
        resave: false,
        saveUninitialized: false,
    })

    app.use(sessionMiddleware);

    await pool.runMigrations();

    const server = require('http').createServer(app);

    app.post("/register", async (req,res) => {
        const result = await register(req)
        result != undefined ? req.session.userId = result : null;
        res.sendStatus(200);
    })

    app.post("/login", async (req,res) => {
        const result = await login(pool, req.body.values)
        result != undefined ? req.session.userId = result : null;
        res.sendStatus(200);
    })

    app.get("/me", async (req,res) => {
        const username = await me(pool, req)
        res.send(username);
    })

    app.get("/logout", async (req,res) => {
        await logout(req,res)
        res.sendStatus(200)
    })

    app.use(RoomRouter)
    app.use(RoomInfoRouter)
    app.use(MessageRouter)
    app.use(ReactionRouter)
    app.use(ResponseRouter)
    app.use(MembersRouter)

    app.use(cookieParser)

    server.listen(3001)
}

main().catch((err) => {
    console.error(err);
});