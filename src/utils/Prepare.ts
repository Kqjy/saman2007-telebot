import { Bot, session, webhookCallback } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { ContextType } from "../types/Types";
import { downloadMenu } from "../menus/Menus";
import { commands } from "../command/Commands";
import { downloadCommandAc, startCommandAc } from "../command/CommandsAction";
import { downloadPostConversation } from "../conversations/Conversations";
import { Express, json } from "express";

const setMiddlewares = (bot: Bot<ContextType>, server: Express) => {
  //bot middlewares
  bot.use(
    session({
      initial() {
        return {};
      },
    })
  );
  bot.use(conversations());

  //set conversations
  bot.use(createConversation(downloadPostConversation));

  //set all commands of bot
  bot.api.setMyCommands(commands);

  //set menues
  bot.use(downloadMenu);

  //set actions of commands
  bot.command("start", startCommandAc);
  bot.command("download", downloadCommandAc);

  //server middlewares
  server.use(json());
  server.get("/", (req, res) => res.send("<h1>welcome!</h1>"));
  server.use(webhookCallback(bot, "express"));
};

export { setMiddlewares };
