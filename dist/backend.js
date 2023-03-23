/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 178:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/// <reference path='./types/.d.ts' />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(376);
const Prepare_1 = __webpack_require__(181);
const grammy_1 = __webpack_require__(842);
const express_1 = __importDefault(__webpack_require__(860));
const port = process.env.PORT || 3000;
const bot = new grammy_1.Bot(process.env.secret_key);
const server = (0, express_1.default)();
const main = () => {
    (0, Prepare_1.setMiddlewares)(bot, server);
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
exports["default"] = server;


/***/ }),

/***/ 736:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.commands = void 0;
const commands = [
    { command: "start", description: "Start the bot" },
    {
        command: "download",
        description: "download a post, story or profile image.",
    },
];
exports.commands = commands;


/***/ }),

/***/ 200:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.downloadCommandAc = exports.startCommandAc = void 0;
const Menus_1 = __webpack_require__(866);
const startCommandAc = async (ctx) => {
    await ctx.reply("hello! welcome to this bot. in this bot, you have access to great instagram tools for free!");
};
exports.startCommandAc = startCommandAc;
const downloadCommandAc = async (ctx) => {
    await ctx.reply("what do you want to download?", {
        reply_markup: Menus_1.downloadMenu,
    });
};
exports.downloadCommandAc = downloadCommandAc;


/***/ }),

/***/ 835:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.downloadPostConversation = void 0;
const Helpers_1 = __webpack_require__(448);
const downloadPostConversation = async (conversation, ctx) => {
    await ctx.reply("enter the url of post: ");
    const { message } = await conversation.wait();
    if ((0, Helpers_1.isInstagramUrl)(message === null || message === void 0 ? void 0 : message.text)) {
        try {
            await ctx.reply("please wait...");
            const slideUrls = await (0, Helpers_1.getSlidesInputMedia)(message === null || message === void 0 ? void 0 : message.text);
            await ctx.replyWithMediaGroup(slideUrls);
        }
        catch (error) {
            await ctx.reply("something went wrong... please try again later.");
            console.log(error);
        }
    }
    else {
        await ctx.reply("please enter the url of post that you want to download.");
    }
};
exports.downloadPostConversation = downloadPostConversation;


/***/ }),

/***/ 866:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.downloadMenu = void 0;
const menu_1 = __webpack_require__(993);
const downloadMenu = new menu_1.Menu("download")
    .text("a post", async (ctx) => {
    await ctx.conversation.enter("downloadPostConversation");
})
    .text("a story")
    .text("a profile image");
exports.downloadMenu = downloadMenu;


/***/ }),

/***/ 448:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSlidesInputMedia = exports.isInstagramUrl = void 0;
const instagram_id_to_url_segment_1 = __webpack_require__(948);
const instagram_private_api_1 = __webpack_require__(95);
/* import NodeCache from "node-cache"; */
/* const cache = new NodeCache(); */
const loginInTostagram = async () => {
    /*   const cachedData = cache.get("ig");
    
      if (cachedData) return cachedData; */
    const ig = new instagram_private_api_1.IgApiClient();
    //login to instagram
    ig.state.generateDevice(process.env.insta_username);
    await ig.account.login(process.env.insta_username, process.env.insta_password);
    /*   cache.set("ig", ig, 60 ** 2); */
    return ig;
};
const isInstagramUrl = (url) => {
    return url.startsWith("https://www.instagram.com/");
};
exports.isInstagramUrl = isInstagramUrl;
async function getSlidesInputMedia(postUrl) {
    const ig = await loginInTostagram();
    //get the post id in the url and generate an instagram id
    const postId = (0, instagram_id_to_url_segment_1.urlSegmentToInstagramId)(postUrl.split("/")[4]);
    //get the infos of post
    const postInfos = await ig.media.info(postId);
    //the actual post datas
    const postItem = postInfos.items[0];
    //if the post has only one slide of video or photo, it should be handeled like this
    if (postItem.media_type === 1)
        return [
            { media: postItem.image_versions2.candidates[0].url, type: "video" },
        ];
    else if (postItem.media_type === 2)
        return [{ media: postItem.video_versions[0].url, type: "video" }];
    const slides = postItem.carousel_media || postItem.video_versions;
    //get the urls of all slides
    const urls = slides.map((post) => {
        //type 2 is video and type 1 is photo
        if (post.media_type === 2) {
            return {
                media: post.video_versions[0].url,
                type: "video",
            };
        }
        else {
            return {
                media: post.image_versions2.candidates[0].url,
                type: "photo",
            };
        }
    });
    return urls;
}
exports.getSlidesInputMedia = getSlidesInputMedia;


/***/ }),

/***/ 376:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const dotenv_1 = __importDefault(__webpack_require__(142));
const path_1 = __importDefault(__webpack_require__(17));
const devMode = "production" === "development";
dotenv_1.default.config({
    path: devMode
        ? path_1.default.resolve(__dirname, "..", "configs", "config.env")
        : path_1.default.resolve(__dirname, "configs", "config.env"),
});


/***/ }),

/***/ 181:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setMiddlewares = void 0;
const grammy_1 = __webpack_require__(842);
const conversations_1 = __webpack_require__(466);
const Menus_1 = __webpack_require__(866);
const Commands_1 = __webpack_require__(736);
const CommandsAction_1 = __webpack_require__(200);
const Conversations_1 = __webpack_require__(835);
const express_1 = __webpack_require__(860);
const setMiddlewares = (bot, server) => {
    //bot middlewares
    bot.use((0, grammy_1.session)({
        initial() {
            return {};
        },
    }));
    bot.use((0, conversations_1.conversations)());
    //set conversations
    bot.use((0, conversations_1.createConversation)(Conversations_1.downloadPostConversation));
    //set all commands of bot
    bot.api.setMyCommands(Commands_1.commands);
    //set menues
    bot.use(Menus_1.downloadMenu);
    //set actions of commands
    bot.command("start", CommandsAction_1.startCommandAc);
    bot.command("download", CommandsAction_1.downloadCommandAc);
    //server middlewares
    server.use((0, express_1.json)());
    server.get("/", (req, res) => res.send("<h1>welcome!</h1>"));
    server.use((0, grammy_1.webhookCallback)(bot, "express"));
};
exports.setMiddlewares = setMiddlewares;


/***/ }),

/***/ 466:
/***/ ((module) => {

module.exports = require("@grammyjs/conversations");

/***/ }),

/***/ 993:
/***/ ((module) => {

module.exports = require("@grammyjs/menu");

/***/ }),

/***/ 142:
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ 860:
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ 842:
/***/ ((module) => {

module.exports = require("grammy");

/***/ }),

/***/ 948:
/***/ ((module) => {

module.exports = require("instagram-id-to-url-segment");

/***/ }),

/***/ 95:
/***/ ((module) => {

module.exports = require("instagram-private-api");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(178);
/******/ 	
/******/ })()
;