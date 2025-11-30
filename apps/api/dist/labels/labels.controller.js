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
exports.LabelsController = void 0;
const common_1 = require("@nestjs/common");
const labels_service_1 = require("./labels.service");
const create_label_dto_1 = require("./dto/create-label.dto");
const update_label_dto_1 = require("./dto/update-label.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let LabelsController = class LabelsController {
    constructor(labelsService) {
        this.labelsService = labelsService;
    }
    create(createLabelDto) {
        return this.labelsService.create(createLabelDto);
    }
    findByBoard(boardId) {
        return this.labelsService.findByBoard(boardId);
    }
    findOne(id) {
        return this.labelsService.findOne(id);
    }
    update(id, updateLabelDto) {
        return this.labelsService.update(id, updateLabelDto);
    }
    remove(id) {
        return this.labelsService.remove(id);
    }
    assignToCard(labelId, cardId) {
        return this.labelsService.assignToCard(cardId, labelId);
    }
    unassignFromCard(labelId, cardId) {
        return this.labelsService.unassignFromCard(cardId, labelId);
    }
    getCardLabels(cardId) {
        return this.labelsService.getCardLabels(cardId);
    }
};
exports.LabelsController = LabelsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_label_dto_1.CreateLabelDto]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('boardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "findByBoard", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_label_dto_1.UpdateLabelDto]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':labelId/assign/:cardId'),
    __param(0, (0, common_1.Param)('labelId')),
    __param(1, (0, common_1.Param)('cardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "assignToCard", null);
__decorate([
    (0, common_1.Delete)(':labelId/unassign/:cardId'),
    __param(0, (0, common_1.Param)('labelId')),
    __param(1, (0, common_1.Param)('cardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "unassignFromCard", null);
__decorate([
    (0, common_1.Get)('card/:cardId'),
    __param(0, (0, common_1.Param)('cardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "getCardLabels", null);
exports.LabelsController = LabelsController = __decorate([
    (0, common_1.Controller)('labels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [labels_service_1.LabelsService])
], LabelsController);
//# sourceMappingURL=labels.controller.js.map