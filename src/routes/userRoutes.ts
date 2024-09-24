import { Router } from 'express';
import multer from 'multer';
import {
  uploadCSV,
  importData,
  getAllUsers,
  updateUser,
  deleteUser,
  exportToExcel,
} from '../controllers/userController';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadCSV);
router.post('/import', importData);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/export', exportToExcel);

export default router;
