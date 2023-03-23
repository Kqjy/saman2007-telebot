/// <reference path='./types/.d.ts' />

import "./utils/LoadEnv";
import { ContextType } from "./types/Types";
import { setMiddlewares } from "./utils/Prepare";

import { Bot } from "grammy";
import express from "express";

const port = process.env.PORT || 3000;

const bot = new Bot<ContextType>(process.env.secret_key!);
const server = express();

const main = () => {
  setMiddlewares(bot, server);

  server.listen(port, async () => {
    console.log(`server is listening to port ${port}`);

    const webhookUrl = `https://${process.env.DETA_SPACE_APP_HOSTNAME}`;

    await bot.api.deleteWebhook();
    await bot.api.setWebhook(webhookUrl, {
      drop_pending_updates: true,
    });
  });
};

main();

export default server;
