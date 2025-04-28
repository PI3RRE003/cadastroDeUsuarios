import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

export const UserController = {

    async post(request, response) {

        try {
            const { name, email, age } = request.body

            if (!name || !email || !age) {
                return response.status(400).json({ message: 'Campos obrigatórios faltando.' })
            }
        } catch (error) {
            if (error.code === 'P2002') {
                response.status(400).json({ error: 'E-mail já existe.' });
            } else if (error.code === 'P2023') {
                response.status(400).json({ error: 'Formato de dados inválido.' });
            } else {
                response.status(500).json({ error: 'Erro interno.' });
            }

        }
        const user = await prisma.user.create({
            data: request.body
        })

        response.status(201).json(user)
    },


    async get(request, response) {

        try {
            const { name, email, age } = request.query

            let users = []

            if (name) users.name = {
                contains: name, mode: 'insensitive'
            }

            if (email) users.email = email;

            if (age) {

                const ageNumber = Number(age);
                if (isNaN(ageNumber)) {
                    return response.status(400).json({ error: 'Idade deve ser um numero' })
                }
                users.age = ageNumber;
            }

            users = await prisma.user.findMany({
                where: Object.keys(users).length > 0 ? users : undefined
            })

            response.status(200).json(users)

        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            response.status(500).json({ error: "Erro interno ao processar a requisição." });
        }

    },

    async findUnique(request, response) {
        const id = request.params.id; // O ID é passado diretamente como string
        const idRegex = /^[0-9a-fA-F]{24}$/;// Se for um ObjectId (MongoDB)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i; // Se for UUID

        // Verifica se o ID foi passado na URL
        if (!id) {
            return response.status(400).json({ message: 'ID é obrigatório' });
        }

        if (!idRegex.test(id)) {
            return response.status(400).json({ message: 'ID inválido' });
        }

        try {

            const user = await prisma.user.findUnique({
                where: {
                    id: id
                }
            });

            if (!user) {
                return response.status(404).json({ message: 'Usuário não encontrado' });
            }

            return response.status(200).json(user);

        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    async put(request, response) {

        const { id } = request.params;

        const { name, email, age } = request.body

        if (!id) {
            return response.status(400).json({ message: 'ID é obrigatório' });
        }

        try {
            const updatedUser = await prisma.user.update({
                where: { id },
                data: { email, name, age }
            });

            return response.status(200).json(updatedUser); // Retorna o que foi realmente salvo

        } catch (error) {
            console.error(error);
            
            if (error.code === 'P2025') { // P2025 é erro de registro não encontrado no Prisma
                return response.status(404).json({ message: 'Usuário não encontrado' });
            }
            
            return response.status(500).json({ message: 'Erro interno do servidor' });
        }

    },

    async delete (request, response) {
    
        const { id } = request.params;

        if (!id) {
            return response.status(400).json({ message: 'ID é obrigatório' });
        }
        
        try {
            const user = await prisma.user.delete({
                where: { id },
                select: { name: true }
            });

            return response.status(200).json({ message: `Usuário: ${user.name} deletado com sucesso!` });
            
        } catch (error) {
            console.error(error);
        if (error.code === 'P2025') { // P2025 = registro não encontrado no Prisma
            return response.status(404).json({ message: 'Usuário não encontrado' });
        }
        return response.status(500).json({ message: 'Erro interno do servidor' });
    }
            
        }
    
}
