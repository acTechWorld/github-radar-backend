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
exports.TrendingMetric = void 0;
const typeorm_1 = require("typeorm");
let TrendingMetric = class TrendingMetric {
    id;
    language; // e.g., "JavaScript", "Python"
    stars_threshold; // Minimum stars growth score in a week to be trending
    forks_threshold; // Minimum forks growth score in a week to be trending
    watchers_threshold; // Minimum watchers growth score in a week to be trending
    combined_threshold; // Minimum combined growth score of all metrics to be trending
    max_stars; // Minimum stars growth score in a week to be trending
    max_forks; // Minimum forks growth score in a week to be trending
    max_watchers; // Minimum watchers growth score in a week to be trending
    created_at;
    updated_at;
};
exports.TrendingMetric = TrendingMetric;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TrendingMetric.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], TrendingMetric.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.5 }),
    __metadata("design:type", Number)
], TrendingMetric.prototype, "stars_threshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.5 }),
    __metadata("design:type", Number)
], TrendingMetric.prototype, "forks_threshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.5 }),
    __metadata("design:type", Number)
], TrendingMetric.prototype, "watchers_threshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 1.5 }),
    __metadata("design:type", Number)
], TrendingMetric.prototype, "combined_threshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 50 }),
    __metadata("design:type", Number)
], TrendingMetric.prototype, "max_stars", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 50 }),
    __metadata("design:type", Number)
], TrendingMetric.prototype, "max_forks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 50 }),
    __metadata("design:type", Number)
], TrendingMetric.prototype, "max_watchers", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], TrendingMetric.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], TrendingMetric.prototype, "updated_at", void 0);
exports.TrendingMetric = TrendingMetric = __decorate([
    (0, typeorm_1.Entity)('trending_metrics')
], TrendingMetric);
