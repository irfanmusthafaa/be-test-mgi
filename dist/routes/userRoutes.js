"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/upload', upload.single('file'), userController_1.uploadCSV);
router.post('/import', userController_1.importData);
router.get('/users', userController_1.getAllUsers);
router.put('/users/:id', userController_1.updateUser);
router.delete('/users/:id', userController_1.deleteUser);
router.get('/export', userController_1.exportToExcel);
exports.default = router;
