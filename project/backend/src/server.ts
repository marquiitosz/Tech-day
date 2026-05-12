import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json({limit: '10mb'}))
let users: any[] = []

app.post('/users', (req, res) => {

    const { nome, email, tipoEmpresa } = req.body
    const user: any = {id: users.length + 1, nome, email, tipoEmpresa}
    users.push(user)
    res.status(201).json(user)
})

app.get('/users', (req_,res) =>{
    res.json(users)
    res.status(200)
})

app.listen(3000, () =>{
    console.log("Servidor rodando na porta 3000!")

})