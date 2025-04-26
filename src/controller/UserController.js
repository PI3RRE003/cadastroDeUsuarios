import { User } from "../model/UserModel.js"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const UserController = {

    async post(request, response) {

        const { name, email, age } = request.body

        if (!name || !email || !age) {
            return response.status(400).json({ message: 'Campos obrigatórios faltando.' })
        }
        
        const user = await prisma.user.create({
            data: request.body
        })
    
        response.status(201).json(user)
      },

    async get(request,response){

        let users =[]

        
        if(request.query){
            
        users = await prisma.user.findMany({
                where:{
                    name: request.query.name || undefined,
                    email: request.query.email || undefined,
                    age: request.query.age ? Number(request.query.age) : undefined
                }
            })
        }else{
        
             users= await prisma.user.findMany()
        }
    
    
        response.status(200).json(users)

      },

    async findUnique(request,response){
        const id = request.params.id; // O ID é passado diretamente como string

        // Verifica se o ID foi passado na URL
        if (!id) {
            return response.status(400).json({ message: 'ID é obrigatório' });
        }
    
        const user = await prisma.user.findUnique({
            where: {
                id: id // Prisma irá tratar isso como string
            }
        });
    
        if (!user) {
            return response.status(404).json({ message: 'Usuário não encontrado' });
        } else {
            return response.status(200).json(user); // Retorna o usuário encontrado
        }

    },

    async put(request,response){

        await prisma.user.update({
            where:{
                id:  request.params.id || undefined
            },
            data:{
                email:request.body.email,
                name: request.body.name,
                age: request.body.age
            }

        })
        response.status(201).json(request.body)
    },

    async delete(request, response){

       const user = await prisma.user.delete({
            where:{
                id: request.params.id || undefined
            },
            select: { name: true }
        })
        response.status(200).json({message: `Usuario: ${user.name} deletado com sucesso!`})
    }
}