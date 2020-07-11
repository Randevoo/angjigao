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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../User/models");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
let ShoppingItem = class ShoppingItem {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ShoppingItem.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ShoppingItem.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], ShoppingItem.prototype, "price", void 0);
__decorate([
    typeorm_1.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ShoppingItem.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ShoppingItem.prototype, "image_url", void 0);
__decorate([
    typeorm_1.Column(),
    type_graphql_1.Field((type) => [String]),
    __metadata("design:type", Array)
], ShoppingItem.prototype, "categories", void 0);
ShoppingItem = __decorate([
    typeorm_1.Entity(),
    type_graphql_1.ObjectType({ description: 'Object representing a Shopping Item' })
], ShoppingItem);
exports.ShoppingItem = ShoppingItem;
let Order = class Order {
    constructor(id, buyer, seller, charge_id) {
        this.id = id;
        this.buyer = buyer;
        this.seller = seller;
        this.charge_id = charge_id;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    typeorm_1.OneToOne((type) => ShoppingItem),
    typeorm_1.JoinColumn(),
    __metadata("design:type", ShoppingItem)
], Order.prototype, "item", void 0);
__decorate([
    typeorm_1.OneToOne((type) => models_1.User),
    typeorm_1.JoinColumn(),
    __metadata("design:type", models_1.User)
], Order.prototype, "buyer", void 0);
__decorate([
    typeorm_1.OneToOne((type) => models_1.User),
    typeorm_1.JoinColumn(),
    __metadata("design:type", models_1.User)
], Order.prototype, "seller", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Order.prototype, "charge_id", void 0);
Order = __decorate([
    type_graphql_1.ObjectType({ description: 'Object representing an Order' }),
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, models_1.User, models_1.User, String])
], Order);
exports.Order = Order;
