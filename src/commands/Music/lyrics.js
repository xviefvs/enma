"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var discord_akairo_1 = require("discord-akairo");
var LyricsCommand = /** @class */ (function (_super) {
    __extends(LyricsCommand, _super);
    function LyricsCommand() {
        return _super.call(this, 'lyrics', {
            aliases: ['lyrics', 'ly'],
            description: {
                ctx: 'Get the lyrics of a song.',
                usage: '[song]',
                example: ['never gonna give you up']
            },
            args: [
                {
                    id: 'song',
                    match: 'content'
                },
            ]
        }) || this;
    }
    LyricsCommand.prototype.exec = function (message, _a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        var song = _a.song;
        return __awaiter(this, void 0, void 0, function () {
            var player, embed, firstRES, lyrics, name_1, first_part, second_part, songNAME, secondRES_1, _lyrics_1, _name_1, _first_part, _second_part, secondRES, _lyrics, _name, _first_part, _second_part;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        player = this.client.music.players.get((_b = message.guild) === null || _b === void 0 ? void 0 : _b.id);
                        embed = this.client.util.embed().setColor('BLURPLE');
                        if (!!player) return [3 /*break*/, 2];
                        if (!song)
                            return [2 /*return*/, (_c = message.util) === null || _c === void 0 ? void 0 : _c.send('> You need to give me a song name to search lyrics for.')];
                        return [4 /*yield*/, this.client.ksoft.lyrics.get(song, {
                                textOnly: false
                            })];
                    case 1:
                        firstRES = _p.sent();
                        lyrics = firstRES.lyrics, name_1 = firstRES.name;
                        if (lyrics.length > 2048) {
                            first_part = lyrics.slice(0, 2048);
                            second_part = lyrics.slice(2048);
                            embed.setDescription(first_part);
                            embed.setTitle(name_1);
                            (_d = message.util) === null || _d === void 0 ? void 0 : _d.send(embed);
                            (_e = message.util) === null || _e === void 0 ? void 0 : _e.send(this.client.util
                                .embed()
                                .setDescription(second_part)
                                .setColor('BLURPLE')
                                .setFooter('Powered by KSoft.Si', 'https://cdn.ksoft.si/images/Logo1024.png'));
                        }
                        embed.setTitle(name_1);
                        embed.setDescription(lyrics);
                        embed.setFooter('Powered by KSoft.Si', 'https://cdn.ksoft.si/images/Logo1024.png');
                        return [2 /*return*/, (_f = message.util) === null || _f === void 0 ? void 0 : _f.send(embed)];
                    case 2:
                        if (!(player && !song)) return [3 /*break*/, 4];
                        songNAME = (_g = player === null || player === void 0 ? void 0 : player.queue.current) === null || _g === void 0 ? void 0 : _g.title;
                        return [4 /*yield*/, this.client.ksoft.lyrics.get(songNAME, {
                                textOnly: false
                            })];
                    case 3:
                        secondRES_1 = _p.sent();
                        _lyrics_1 = secondRES_1.lyrics, _name_1 = secondRES_1.name;
                        if (_lyrics_1.length > 2048) {
                            _first_part = _lyrics_1.slice(0, 2048);
                            _second_part = _lyrics_1.slice(2048);
                            embed.setDescription(_first_part);
                            embed.setTitle(_name_1);
                            (_h = message.util) === null || _h === void 0 ? void 0 : _h.send(embed);
                            (_j = message.util) === null || _j === void 0 ? void 0 : _j.send(this.client.util
                                .embed()
                                .setColor('BLURPLE')
                                .setDescription(_second_part)
                                .setFooter('Powered by KSoft.Si', 'https://cdn.ksoft.si/images/Logo1024.png'));
                        }
                        embed.setTitle(_name_1);
                        embed.setDescription(_lyrics_1);
                        embed.setFooter('Powered by KSoft.Si', 'https://cdn.ksoft.si/images/Logo1024.png');
                        return [2 /*return*/, (_k = message.util) === null || _k === void 0 ? void 0 : _k.send(embed)];
                    case 4: return [4 /*yield*/, this.client.ksoft.lyrics.get(song, {
                            textOnly: false
                        })];
                    case 5:
                        secondRES = _p.sent();
                        _lyrics = secondRES.lyrics, _name = secondRES.name;
                        if (_lyrics.length > 2048) {
                            _first_part = _lyrics.slice(0, 2048);
                            _second_part = _lyrics.slice(2048);
                            embed.setDescription(_first_part);
                            embed.setTitle(_name);
                            (_l = message.util) === null || _l === void 0 ? void 0 : _l.send(embed);
                            (_m = message.util) === null || _m === void 0 ? void 0 : _m.send(this.client.util
                                .embed()
                                .setColor('BLURPLE')
                                .setDescription(_second_part)
                                .setFooter('Powered by KSoft.Si', 'https://cdn.ksoft.si/images/Logo1024.png'));
                        }
                        embed.setTitle(_name);
                        embed.setDescription(_lyrics);
                        embed.setFooter('Powered by KSoft.Si', 'https://cdn.ksoft.si/images/Logo1024.png');
                        return [2 /*return*/, (_o = message.util) === null || _o === void 0 ? void 0 : _o.send(embed)];
                }
            });
        });
    };
    return LyricsCommand;
}(discord_akairo_1.Command));
exports["default"] = LyricsCommand;
