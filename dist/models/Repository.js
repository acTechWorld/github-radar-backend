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
exports.Repository = void 0;
const typeorm_1 = require("typeorm");
const Language_1 = require("./Language");
const TrendingMetric_1 = require("./TrendingMetric");
let Repository = class Repository {
    id;
    github_id;
    name;
    description;
    html_url;
    owner_name;
    owner_avatar_url;
    stars_count;
    stars_history;
    stars_last_week;
    getStarsLastWeek() {
        const listStars = this.stars_history?.split(',');
        if (listStars && listStars.length > 0) {
            const lastStars = parseInt(listStars[0]);
            const firstStars = parseInt(listStars[listStars.length - 1]);
            this.stars_last_week = listStars && listStars.length > 0 && !isNaN(lastStars) && !isNaN(firstStars) ? lastStars - firstStars : 0;
        }
        else {
            this.stars_last_week = 0;
        }
    }
    forks_count;
    forks_history;
    forks_last_week;
    getForksLastWeek() {
        const listForks = this.forks_history?.split(',');
        if (listForks && listForks?.length > 0) {
            const lastForks = parseInt(listForks[0]);
            const firstForks = parseInt(listForks[listForks.length - 1]);
            this.forks_last_week = listForks && listForks.length > 0 && !isNaN(lastForks) && !isNaN(firstForks) ? lastForks - firstForks : 0;
        }
        else {
            this.forks_last_week = 0;
        }
    }
    watchers_count;
    watchers_history;
    watchers_last_week;
    getFWatchersLastWeek() {
        const listWatchers = this.watchers_history?.split(',');
        if (listWatchers && listWatchers?.length > 0) {
            const lastWatchers = parseInt(listWatchers[0]);
            const firstWatchers = parseInt(listWatchers[listWatchers.length - 1]);
            this.watchers_last_week = listWatchers && listWatchers.length > 0 && !isNaN(lastWatchers) && !isNaN(firstWatchers) ? lastWatchers - firstWatchers : 0;
        }
        else {
            this.watchers_last_week = 0;
        }
    }
    open_issues_count;
    languages;
    license;
    topics;
    //Repo Date
    creation_date;
    //Repo Date
    last_updated;
    //Technical Date
    created_at;
    //Technical Date
    updated_at;
    owner_type; // 'Organization' or 'Individual'
    trending_metrics;
};
exports.Repository = Repository;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Repository.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unique: true }),
    __metadata("design:type", Number)
], Repository.prototype, "github_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Repository.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Repository.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Repository.prototype, "html_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Repository.prototype, "owner_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Repository.prototype, "owner_avatar_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Repository.prototype, "stars_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Repository.prototype, "stars_history", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Repository.prototype, "stars_last_week", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Repository.prototype, "getStarsLastWeek", null);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Repository.prototype, "forks_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Repository.prototype, "forks_history", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Repository.prototype, "forks_last_week", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Repository.prototype, "getForksLastWeek", null);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Repository.prototype, "watchers_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Repository.prototype, "watchers_history", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Repository.prototype, "watchers_last_week", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Repository.prototype, "getFWatchersLastWeek", null);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Repository.prototype, "open_issues_count", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Language_1.Language, (language) => language.repositories, { cascade: true }),
    (0, typeorm_1.JoinTable)({
        name: 'repository_languages',
        joinColumn: {
            name: 'repository_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'language_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Repository.prototype, "languages", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Repository.prototype, "license", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Array)
], Repository.prototype, "topics", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Repository.prototype, "creation_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Repository.prototype, "last_updated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Repository.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Repository.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Repository.prototype, "owner_type", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => TrendingMetric_1.TrendingMetric, (trending_metric) => trending_metric.repositories, { cascade: true }),
    (0, typeorm_1.JoinTable)({
        name: 'repository_trending_metrics',
        joinColumn: {
            name: 'repository_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'trending_metric_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Repository.prototype, "trending_metrics", void 0);
exports.Repository = Repository = __decorate([
    (0, typeorm_1.Entity)('repositories')
], Repository);
