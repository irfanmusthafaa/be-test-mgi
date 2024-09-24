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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToExcel = exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.importData = exports.uploadCSV = void 0;
const User_1 = __importDefault(require("../models/User"));
const XLSX = __importStar(require("xlsx"));
const exceljs_1 = __importDefault(require("exceljs"));
// Upload CSV dan konversi ke JSON
const uploadCSV = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    res.json(jsonData);
};
exports.uploadCSV = uploadCSV;
// Import data ke database
const importData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = req.body;
        yield User_1.default.insertMany(users);
        res.status(201).send('Data imported successfully.');
    }
    catch (error) {
        res.status(500).send('Error importing data');
    }
});
exports.importData = importData;
// Ambil semua data
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.json({ data: users });
    }
    catch (error) {
        res.status(500).send('Error retrieving data');
    }
});
exports.getAllUsers = getAllUsers;
// Update data
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedUser = yield User_1.default.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).send('Error updating user');
    }
});
exports.updateUser = updateUser;
// Hapus data
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield User_1.default.findByIdAndDelete(id);
        res.send('User deleted');
    }
    catch (error) {
        res.status(500).send('Error deleting user');
    }
});
exports.deleteUser = deleteUser;
const exportToExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ambil semua data dari MongoDB
        const users = yield User_1.default.find();
        // Buat workbook baru
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('Users');
        // Tambahkan header ke worksheet
        worksheet.columns = [
            { header: 'id', key: 'id', width: 10 },
            { header: 'nama', key: 'nama', width: 20 },
            { header: 'email', key: 'email', width: 30 },
            { header: 'telepon', key: 'telepon', width: 15 },
            { header: 'alamat', key: 'alamat', width: 30 },
        ];
        // Tambahkan data ke worksheet
        users.forEach(user => {
            worksheet.addRow({
                id: user.id,
                nama: user.nama,
                email: user.email,
                telepon: user.telepon,
                alamat: user.alamat
            });
        });
        // Siapkan response untuk mengunduh file Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
        // Kirimkan file Excel ke klien
        yield workbook.xlsx.write(res);
        res.status(200).end();
    }
    catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ message: 'Error exporting data' });
    }
});
exports.exportToExcel = exportToExcel;
// Ekspor data ke Excel
// export const exportToExcel = async (req: Request, res: Response) => {
//   try {
//     const users = await User.find();
//     const json2csvParser = new Parser();
//     const csv = json2csvParser.parse(users);
//     const filePath = './exports/users.csv';
//     fs.writeFileSync(filePath, csv);
//     res.download(filePath, 'users.csv', (err) => {
//       if (err) {
//         res.status(500).send('Error exporting data');
//       }
//       fs.unlinkSync(filePath);
//     });
//   } catch (error) {
//     res.status(500).send('Error exporting data');
//   }
// };
