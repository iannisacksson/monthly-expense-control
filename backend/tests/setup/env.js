"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
process.env.NODE_ENV = "test";
(0, dotenv_1.config)({ path: ".env.test" });
