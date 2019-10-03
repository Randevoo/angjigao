"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const types_1 = __importDefault(require("./types"));
const input_1 = __importDefault(require("./input"));
let SignUpFormResolver = class SignUpFormResolver {
    getForm() {
        return "Not implemented";
    }
    submitForm({ email, phone, q1, q2, q3, q4, mailing }, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield context.firebaseDb.ref("test").push({
                email: email || "",
                phone: phone || "",
                q1,
                q2,
                q3,
                q4,
                mailing
            });
            return new types_1.default(q1, q2, q3, q4, mailing, email, phone);
        });
    }
};
__decorate([
    type_graphql_1.Query(returns => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], SignUpFormResolver.prototype, "getForm", null);
__decorate([
    type_graphql_1.Mutation(returns => types_1.default),
    __param(0, type_graphql_1.Arg("formInput")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [input_1.default, Object]),
    __metadata("design:returntype", Promise)
], SignUpFormResolver.prototype, "submitForm", null);
SignUpFormResolver = __decorate([
    type_graphql_1.Resolver()
], SignUpFormResolver);
exports.default = SignUpFormResolver;
