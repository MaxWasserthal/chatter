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
import { logout } from "./utils/logout";
import { RoomRouter } from "./routes/rooms";
import { RoomInfoRouter } from "./routes/room-info";
import { MessageRouter } from "./routes/messages";
import { ReactionRouter } from "./routes/reactions";
import { ResponseRouter } from "./routes/responses";
import { MembersRouter } from "./routes/members";
import { Logtimes } from "./entities/Logtimes";
import { logtimes } from "./utils/logtimes";
import { MeRouter } from "./routes/me";

const main = async () => {

    // define express app
    const app = express()
    // define cookieParser
    const cookieParser = require('cookie-parser')()

    // define new redis store
    const RedisStore = require('connect-redis')(session)
    const redis = new Redis(6379, 'localhost') // port for redis db
    // create database connection
    const pool = await createConnection({
        type: "postgres",
        // get values from .env file
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as any),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        logging: true,
        // define entities from typeorm to use
        entities: [Member, Message, Reaction, Role, Room, MemberRoom, Logtimes],
        // define migrations folder
        migrations: [path.join(__dirname, "./migrations/*")]
    })

    // enable cors from frontend
    app.use(cors({
        origin: process.env.ORIGIN_URL,
        credentials: true,
    }));

    app.options('*', cors)

    // use json to work with requests and responses
    app.use(express.json());

    // define session with cookie in redis
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

    // use the session middleware
    app.use(sessionMiddleware);

    // run all migrations in migrations folder
    await pool.runMigrations();

    // create http server
    const server = require('http').createServer(app);

    // catch register call
    app.post("/register", async (req,res) => {
        const result = await register(req)
        if(result.errorRes !== "") {
            res.status(500).send({message:result.errorRes})
        } else {
            // set userId in session if no errors
            req.session.userId = result.userId
            res.sendStatus(200)
        }
    })

    // catch login call
    app.post("/login", async (req,res) => {
        const result = await login(req.body.values)
        if(result.errorRes !== "") {
            res.status(500).send({message:result.errorRes})
        } else {
            // set userId in session if no errors
            req.session.userId = result.userId
            res.sendStatus(200)
        }
    })

    // catch logout call
    app.get("/logout", async (req,res) => {
        await logout(req,res)
        res.sendStatus(200)
    })

    // catch logtimes call
    app.get("/logtimes", async (req,res) => {
        const lt = await logtimes(req)
        res.send(lt)
    })

    // use all routers defined in ./routers
    app.use(RoomRouter)
    app.use(RoomInfoRouter)
    app.use(MessageRouter)
    app.use(ReactionRouter)
    app.use(ResponseRouter)
    app.use(MembersRouter)
    app.use(MeRouter)

    // use cookieParser
    app.use(cookieParser)

    // launch server on port 3001
    server.listen(3001)
}

// execute main function
main().catch((err) => {
    console.error(err);
});