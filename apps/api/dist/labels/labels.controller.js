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
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const labels_service_1 = require("./labels.service");
const create_label_dto_1 = require("./dto/create-label.dto");
const update_label_dto_1 = require("./dto/update-label.dto");
let LabelsController = class LabelsController {
    constructor(labelsService) {
        this.labelsService = labelsService;
    }
    getLabelsByBoard(boardId, req) {
        return this.labelsService.getLabelsByBoard(req.user.id, boardId);
    }
    createLabel(boardId, dto, req) {
        return this.labelsService.createLabel(req.user.id, boardId, dto);
    }
    updateLabel(labelId, dto, req) {
        return this.labelsService.updateLabel(req.user.id, labelId, dto);
    }
    deleteLabel(labelId, req) {
        return this.labelsService.deleteLabel(req.user.id, labelId);
    }
};
exports.LabelsController = LabelsController;
__decorate([
    (0, common_1.Get)('boards/:id/labels'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "getLabelsByBoard", null);
__decorate([
    (0, common_1.Post)('boards/:id/labels'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_label_dto_1.CreateLabelDto, Object]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "createLabel", null);
__decorate([
    (0, common_1.Patch)('labels/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_label_dto_1.UpdateLabelDto, Object]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "updateLabel", null);
__decorate([
    (0, common_1.Delete)('labels/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "deleteLabel", null);
exports.LabelsController = LabelsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [labels_service_1.LabelsService])
], LabelsController);
//# sourceMappingURL=labels.controller.js.map