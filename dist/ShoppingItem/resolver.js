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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const models_1 = require("./models");
const input_1 = require("./input");
let ShoppingItemResolver = class ShoppingItemResolver {
    getItem(itemId, context) {
        return __awaiter(this, void 0, void 0, function* () {
            return context.db.getRepository(models_1.ShoppingItem).findOne(itemId);
        });
    }
    // @Mutation((returns) => Trip)
    // async bookTrip(
    //   @Arg('bookingInput')
    //   { booked_by, trip_uuid, charge_id }: BookingInput,
    //   @Ctx() context: Context,
    // ): Promise<Trip> {
    //   await context.firebaseDb.ref('booking').child(uuid_v4()).set({
    //     trip_uuid: trip_uuid,
    //     booked_by: booked_by,
    //     charge_id: charge_id,
    //   });
    //   const {
    //     id,
    //     name,
    //     price,
    //     type,
    //     description,
    //     booking_uuid,
    //     guide_uuid,
    //     trip_start,
    //     trip_end,
    //     unavailable_times,
    //     image_url,
    //   } = await context.firebaseDb
    //     .ref('trips')
    //     .child(trip_uuid)
    //     .once('value')
    //     .then((snapshot) => snapshot.val());
    //   return new Trip({
    //     id,
    //     name,
    //     price,
    //     type,
    //     description,
    //     booking_uuid,
    //     guide_uuid,
    //     trip_start,
    //     trip_end,
    //     unavailable_times,
    //     image_url,
    //   });
    // }
    createItem({ name, price, description, categories, image_url }, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let shoppingItem = new models_1.ShoppingItem();
            shoppingItem.categories = categories;
            shoppingItem.name = name;
            shoppingItem.price = price;
            shoppingItem.description = description;
            shoppingItem.image_url = image_url;
            return context.db.getRepository(models_1.ShoppingItem).create(shoppingItem);
        });
    }
};
__decorate([
    type_graphql_1.Query((returns) => models_1.ShoppingItem),
    __param(0, type_graphql_1.Arg('itemId')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShoppingItemResolver.prototype, "getItem", null);
__decorate([
    type_graphql_1.Mutation((returns) => models_1.ShoppingItem),
    __param(0, type_graphql_1.Arg('tripInput')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [input_1.ShoppingItemInput, Object]),
    __metadata("design:returntype", Promise)
], ShoppingItemResolver.prototype, "createItem", null);
ShoppingItemResolver = __decorate([
    type_graphql_1.Resolver()
], ShoppingItemResolver);
exports.default = ShoppingItemResolver;
