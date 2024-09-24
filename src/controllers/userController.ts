import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import * as XLSX from 'xlsx';
import { Parser } from 'json2csv';
import * as fs from 'fs';
import ExcelJS from 'exceljs';

// Upload CSV dan konversi ke JSON
export const uploadCSV = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  res.json(jsonData);
};

// Import data ke database
export const importData = async (req: Request, res: Response) => {
  try {
    const users = req.body;
    await User.insertMany(users);
    res.status(201).send({message: 'Data imported successfully.'});
  } catch (error) {
    res.status(500).send({message: 'Error importing data'});
  }
};

// Ambil semua data
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json({data : users});
  } catch (error) {
    res.status(500).send('Error retrieving data');
  }
};

// Update data
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.json({data: updatedUser, message: "Update data successfull"});
  } catch (error) {
    res.status(500).send('Error updating user');
  }
};

// Hapus data
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.send({message: 'User deleted successfully'});
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
};

//export Data
export const exportToExcel = async (req: Request, res: Response) => {
    try {
      const users = await User.find();
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users');
  
      worksheet.columns = [
        { header: 'id', key: 'id', width: 10 },
        { header: 'nama', key: 'nama', width: 20 },
        { header: 'email', key: 'email', width: 30 },
        { header: 'telepon', key: 'telepon', width: 15 },
        { header: 'alamat', key: 'alamat', width: 30 },
      ];
  
      users.forEach(user => {
        worksheet.addRow({
          id: user.id,
          nama: user.nama,
          email: user.email,
          telepon: user.telepon,
          alamat: user.alamat
        });
      });
  

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
  
      
      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error) {
      console.error('Error exporting data:', error);
      res.status(500).json({ message: 'Error exporting data' });
    }
  };

