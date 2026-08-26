import express from "express"
import cors from "cors"
import type { user} from "/home/markitosz/develop/tech-day/Tech-day/project/types/classes.ts"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

let users: user[] = []

interface jwtPayload {
    id: string,
    role: string

}

const mySecretKey = 'fallback_super_secret_key_123!'
const TOKEN_EXPIRATION = '1h'; 

app.post('/logon', async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ error: "Dados do usuário são obrigatórios" })
    }
   
    
    const { nome, email, senha, tipoEmpresa } = req.body
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(senha, saltRounds)
    const user: user = { 
        id: (users.length + 1).toString(), nome, email, senha: hashedPassword, tipoEmpresa 
    }
    const payloadUser = {
        id: user.id, nome: user.nome, email: user.email, senha: user.senha, tipoEmpresa: user.tipoEmpresa
    }
    const payload: jwtPayload = {
        id: user.id.toString(),
        role: 'user'
    }
     const token = jwt.sign(
      payload, 
      mySecretKey, 
      { 
        expiresIn: TOKEN_EXPIRATION,
        algorithm: 'HS256'
      }
    );

    users.push(user)
    res.status(201).json({
        payloadUser,
        message: "Usuário cadastrado com sucesso!",
        token: token

    })

})

app.post('/login', async (req, res) => {

    if(!req.body){
        return res.status(400).json({error: "Erro ao realizar login, tente novamente!"})
    }

    const {email,senha} = req.body
    const usuario: user | undefined = users.find(u => u.email === email)

    if(!usuario || !senha){
        return res.status(401).json({error: "Email ou senha inválidos!"})
    }
    bcrypt.compare(senha, usuario.senha, (err, result) => {

        if(err){
            return res.status(500).json({error: "Erro ao realizar login, tente novamente!"})
        }

        if (result){
            const payload: jwtPayload = {
                id: usuario.id.toString(),
                role: 'user'
            }
            const token = jwt.sign(
                payload, 
                mySecretKey, 
            { 
                expiresIn: TOKEN_EXPIRATION,
                 algorithm: 'HS256'
            }
            
    );
            return res.status(200).json({

                messsage: "Login realizado com sucesso!",
                user: usuario,
                token: token
            })

        }

        return res.status(401).json({error: "Email ou senha inválidos!"}) 
        
    })




})

app.get('/users', (req_, res) => {
    res.json(users)
    res.status(200)
})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000!")

})