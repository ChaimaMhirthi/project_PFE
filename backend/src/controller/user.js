// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const createUser = async (userData) => {  
//     try {
//         const newUser = await prisma.user.create({
//             data: userData
//         });
//         return newUser;
//     } catch (error) {
//         console.error('Error creating user:', error);
//         throw error;
//     }
// };  

// const updateUser = async (id, userData) => {
//     try {
//         const updatedUser = await prisma.user.update({
//             where: {
//                 id: id
//             },
//             data: userData
//         });
//         return updatedUser;
//     } catch (error) {
//         console.error('Error updating user:', error);
//         throw error;
//     }
// };

// const deleteUser = async (id) => {
//     try {
//         const deletedUser = await prisma.user.delete({
//             where: {
//                 id: id
//             }
//         });
//         return deletedUser;
//     } catch (error) {
//         console.error('Error deleting user:', error);
//         throw error;
//     }
// }

// const getUserById = async (id) => {
//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 id: id
//             }
//         });
//         return user;
//     } catch (error) {
//         console.error('Error getting user:', error);
//         throw error;
//     }
// }

// const getAllUsers = async () => { 
//     try {
//         const users = await prisma.user.findMany();
//         return users;
//     } catch (error) {
//         console.error('Error getting users:', error);
//         throw error;
//     }
// }

// const getUserByEmail = async (userData) => {
//     try {
//         const user = await prisma.user.findFirst({
//             where: {
//                 email: userData.email
//             }
//         });
//         return user;
//     } catch (error) {
//         console.error('Error getting user:', error);
//         throw error;
//     }
// }

// module.exports = { getUserByEmail, createUser, updateUser, deleteUser, getUserById, getAllUsers};