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
import { Socket } from "socket.io";
// import type { SessionSocket } from './types';
import path from 'path';
import { createConnection } from 'typeorm';
import { register } from "./utils/register";
import { login } from "./utils/login";
import { createRoom } from "./utils/create-room";
import { COOKIE_NAME } from "./constants";
import { me } from "./utils/me";
import { logout } from "./utils/logout";
import { rooms } from "./utils/rooms";
import { members } from './utils/members';
import { MemberRoom } from "./entities/MemberRoom";

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

    const wrap = (middleware:any) => (socket:Socket, next:any) => middleware(socket.request, {}, next);

    await pool.runMigrations();

    const server = require('http').createServer(app);

    const io = require('socket.io')(server, {
        withCredentials: true,
        cors: {
            origin: 'http://localhost:3000',
            credentials: true,
        }
    });

    io.use(wrap(sessionMiddleware))

    app.post("/register", async (req,res) => {
        const result = await register(pool, req.body.values)
        result != undefined ? req.session.userId = result : null;
        res.sendStatus(200);
    })

    app.post("/login", async (req,res) => {
        const result = await login(pool, req.body.values)
        result != undefined ? req.session.userId = result : null;
        res.sendStatus(200);
    })

    app.post("/create-room", async (req,res) => {
        const result = await createRoom(pool, req.body.values, req.session.userId as number)
        result ? res.sendStatus(200) : res.sendStatus(500);
    })

    app.get("/me", async (req,res) => {
        const username = await me(pool, req)
        res.send(username);
    })

    app.get("/logout", async (req,res) => {
        await logout(req,res)
        res.sendStatus(200);
    })

    app.get("/rooms", async (req,res) => {
        const myrooms = await rooms(req)
        res.send(myrooms)
    })

    app.get("/members", async (req,res) => {
        const mems = await members(req);
        res.send(mems);
    })

    app.use(cookieParser)

    // io.on('connection', (defaultSocket:SessionSocket) => {
        
    //     const socket = defaultSocket;
    //     socket.on('setId', () => {
    //         socket.request.session.userId = 10
    //     })

    //     socket.on('logId', () => {
    //         console.log("userid",socket.request.session.userId)
    //     })

    //     socket.on('login', (values) => {
    //         console.log(values)
    //         socket.request.session.userId = parseInt(values.usernameOrEmail)
    //         console.log("userid",socket.request.session.userId)
    //         socket.emit('loginresponse', ("Success"))
    //     })

    //     socket.on('register', (values) => {
    //         console.log(values)
    //         socket.emit('registerSuccess', ("hello friend"))
    //     })

    //     socket.on('disconnect', async () => {
    //         console.log(`${socket.id} just disconnected`)
    //     })

    //     socket.on('sendMessage', (values) => {
    //         console.log(values)
    //         socket.emit('sendSuccess', ("Message successfully sent"))
    //     })
    // });

    server.listen(3001)
}

main().catch((err) => {
    console.error(err);
});