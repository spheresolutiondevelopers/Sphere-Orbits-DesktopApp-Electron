"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.err = exports.ok = void 0;
__exportStar(require("./ipc/channels"), exports);
__exportStar(require("./ipc/contracts"), exports);
__exportStar(require("./schemas"), exports);
__exportStar(require("./sync"), exports);
__exportStar(require("./utils"), exports);
// Explicitly export result helpers
var result_1 = require("./utils/result");
Object.defineProperty(exports, "ok", { enumerable: true, get: function () { return result_1.ok; } });
Object.defineProperty(exports, "err", { enumerable: true, get: function () { return result_1.err; } });
//# sourceMappingURL=index.js.map