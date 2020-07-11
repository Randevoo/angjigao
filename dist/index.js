"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const path = __importStar(require("path"));
const type_graphql_1 = require("type-graphql");
const resolver_1 = __importDefault(require("./SignUpForm/resolver"));
const resolver_2 = __importDefault(require("./ShoppingItem/resolver"));
const apollo_server_1 = require("apollo-server");
const typeorm_1 = require("typeorm");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const schema = yield type_graphql_1.buildSchema({
        resolvers: [resolver_1.default, resolver_2.default],
        emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
    });
    const db = yield typeorm_1.createConnection();
    const server = new apollo_server_1.ApolloServer({
        schema,
        context: () => ({
            db,
        }),
        introspection: true,
        playground: true,
    });
    // The `listen` method launches a web server.
    server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
});
startServer();
