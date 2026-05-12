import type {user} from "../../../types/classes"
async function enviarDados(dados: user){
    try {
    const response = await fetch("http://localhost:3000/users", {
       method: "POST",
       body: JSON.stringify(dados),
       headers: {
        "Content-Type": "application/json"
       }

    })
    return response.json()
} catch (error) {
    console.error("Erro ao enviar dados:", error)
    throw error
}
   
}

export default enviarDados