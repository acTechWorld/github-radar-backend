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
exports.AIContent = void 0;
const typeorm_1 = require("typeorm");
let AIContent = class AIContent {
    id;
    name;
    type;
    content;
    //Technical Date
    created_at;
    //Technical Date
    updated_at;
};
exports.AIContent = AIContent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AIContent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], AIContent.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AIContent.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], AIContent.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], AIContent.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AIContent.prototype, "updated_at", void 0);
exports.AIContent = AIContent = __decorate([
    (0, typeorm_1.Entity)('ai_content')
], AIContent);
