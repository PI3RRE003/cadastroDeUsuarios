import express, { request, response } from 'express'
import cors from 'cors'
import userRoutes from './src/Routes/userRoutes.js'

const app = express()

app.use(express.json())//fala para o express usar json
app.use(cors())
app.use(userRoutes)

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))//porta local host


/*

1) TIPO DE ROTA HTTP
2) ENDEREÇO

OBJETIVO:
- CRIAR API DE LISTAGEM DE USUARIO
- LISTAR TODOS USUARIOS
- EDITAR USUÁRIOS
- DELETAR USUARIOS

 */