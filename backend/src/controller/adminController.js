const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerAdmin = async (req, res) => {
  try {
    const nodemailer = async(req,res)=>{
      Send: async (req, res) => {
        const result= await nodemailer("mhirthichaima80@gmail.com",'test',"<h1>goood chamchoum</h1>");
        res.send(result);
      }};
    console.log('init')
    console.log(req.body)
    const { password, ...data } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await prisma.adminaccount.create({
      data: {
        ...data,
        password: hashedPassword,
      }
    });
    res.status(201).json({ message: 'Admin registered successfully', admin });
  
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.adminAccount.findFirst({ where: { email } });
   
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    
    const token = jwt.sign({ id: admin.id }, 'secret_key');
    res.status(200).json({ message: 'Admin logged in successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
const createAdmin = async (req, res) => {
  try {
    const { password, ...data } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await prisma.adminAccount.create({
      data: {
        ...data,
        password: hashedPassword,
      }
    });

    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await prisma.adminAccount.findUnique({ where: { id } });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...data } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.adminAccount.update({
      where: { id },
      data: {
        ...data,
        password: hashedPassword,
      }
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin updated successfully', admin });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await prisma.adminAccount.delete({ where: { id } });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.adminAccount.findMany();

    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

   

module.exports = {
  registerAdmin,
  loginAdmin,
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins,
  nodemailer,
 
};
