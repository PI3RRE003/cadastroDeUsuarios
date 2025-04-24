import express, { request, response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()//conecta com o BD

const app = express()
app.use(express.json())//fala para o express usar json

const users = []
//cria usuario
app.post('/usuarios', async(request, response) =>{
    
    users.push(request.body)

    response.status(201).json(request.body)

    await prisma.user.create({
        data:{
            email:request.body.email,
            name: request.body.name,
            age: request.body.age
        }

        
    })


})
//lista usuarios
app.get('/usuarios', async(request, response) =>{
    
    let users = []
    if(request.query){
     users = await prisma.user.findMany({
        where:{
            name: request.query.name,
            email: request.query.email,
            age: request.query.age
        }
     })
    }else{
        
        const users = await prisma.user.findMany()
    }


    response.status(200).json(users)

})

//altera usuario
app.put('/usuarios/:id', async(request, response) =>{
    
   
    await prisma.user.update({
        where:{
            id:  request.params.id
        },
        data:{
            email:request.body.email,
            name: request.body.name,
            age: request.body.age
        }
    })
    
    response.status(201).json(request.body)
    
})

app.delete('/usuarios/:id', async(request,response) => {
    
    await prisma.user.delete({
        where:{
            id: request.params.id
        }
    })

    response.status(200).json({message: 'Usuario deletado com sucesso!'})
})

app.listen(3000)//porta local host


/*

1) TIPO DE ROTA HTTP
2) ENDEREÇO

OBJETIVO:
- CRIAR API DE LISTAGEM DE USUARIO
- LISTAR TODOS USUARIOS
- EDITAR USUÁRIOS
- DELETAR USUARIOS

 */