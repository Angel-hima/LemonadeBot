require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const DiscordStrategy =
    require("passport-discord").Strategy;

const app = express();

passport.serializeUser(
    (user, done) =>
        done(null, user)
);

passport.deserializeUser(
    (obj, done) =>
        done(null, obj)
);

passport.use(
    new DiscordStrategy(
        {
            clientID:
                process.env.CLIENT_ID,
            clientSecret:
                process.env.CLIENT_SECRET,
            callbackURL:
                process.env.CALLBACK_URL,
            scope: [
                "identify",
                "guilds"
            ]
        },

        (
            accessToken,
            refreshToken,
            profile,
            done
        ) => {
            return done(
                null,
                profile
            );
        }
    )
);

app.use(
    session({
        secret:
            process.env
                .SESSION_SECRET,

        resave: false,
        saveUninitialized:
            false
    })
);

app.use(
    passport.initialize()
);

app.use(
    passport.session()
);

app.get(
    "/auth/discord",
    passport.authenticate(
        "discord"
    )
);

app.get(
    "/auth/discord/callback",

    passport.authenticate(
        "discord",
        {
            failureRedirect:
                "/"
        }
    ),

    (req, res) => {
        res.redirect(
            "http://localhost:5173"
        );
    }
);

app.get(
    "/api/user",
    (req, res) => {

        if (!req.user) {
            return res.json(
                null
            );
        }

        res.json(req.user);
    }
);

app.listen(
    3000,
    () => {
        console.log(
            "🍋 Server running on port 3000"
        );
    }
);