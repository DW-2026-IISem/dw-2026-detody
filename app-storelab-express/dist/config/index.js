"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
var cors = require("cors");
dotenv_1.default.config();
class App {
    constructor(port) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.settings();
        this.middlewares();
        this.routes();
        this.dbConnection();
    }
    settings() {
        this.app.set('port', this.port || process.env.PORT || 4000);
    }
    middlewares() {
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use(cors());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        // Las rutas se configurarán más adelante
    }
    async dbConnection() {
        // Conexion, configuracion y sincronizar BD
    }
    async listen() {
        await this.app.listen(this.app.get('port'));
        console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
    }
}
exports.App = App;
//# sourceMappingURL=index.js.map