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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const board_read_guard_1 = require("../boards/guards/board-read.guard");
const board_write_guard_1 = require("../boards/guards/board-write.guard");
const lists_service_1 = require("./lists.service");
const create_list_dto_1 = require("./dto/create-list.dto");
const move_list_dto_1 = require("./dto/move-list.dto");
let ListsController = class ListsController {
    constructor(svc) {
        this.svc = svc;
    }
    list(boardId, req) {
        return this.svc.list(boardId, req.user.id);
    }
    create(dto, req) {
        return this.svc.create(req.user.id, dto.boardId, dto.title, dto.after);
    }
    move(dto, req) {
        return this.svc.move(req.user.id, dto.listId, dto.boardId, dto.newPosition);
    }
};
exports.ListsController = ListsController;
__decorate([
    (0, common_1.UseGuards)(board_read_guard_1.BoardReadGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('boardId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ListsController.prototype, "list", null);
__decorate([
    (0, common_1.UseGuards)(board_write_guard_1.BoardWriteGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_list_dto_1.CreateListDto, Object]),
    __metadata("design:returntype", void 0)
], ListsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(board_write_guard_1.BoardWriteGuard),
    (0, common_1.Post)('move'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [move_list_dto_1.MoveListDto, Object]),
    __metadata("design:returntype", void 0)
], ListsController.prototype, "move", null);
exports.ListsController = ListsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('lists'),
    __metadata("design:paramtypes", [lists_service_1.ListsService])
], ListsController);
//# sourceMappingURL=lists.controller.js.map