import type {userPayload, user, loginPayload} from "../../../types/tipo"


export async function signUpUser(dados: userPayload): Promise<user>{
    try {
    const response = await fetch("http://localhost:3000/logon", {
       method: "POST",
       body: JSON.stringify(dados),
       headers: {
        "Content-Type": "application/json"
       }

    })
    const resposta = await response.json()
    if (!response.ok) {
        throw new Error(resposta.error ?? "Não foi possível cadastrar o usuário")
    }

    const token = resposta.token

    localStorage.setItem("token", token)
    window.location.href = "/dashboard"
    return resposta
   
} catch (error) {
    console.error("Erro ao enviar dados:", error)
    throw error
}
   
}

export async function loginUser(dados: loginPayload): Promise<user>{
    try {
    const response = await fetch("http://localhost:3000/login", {
       method: "POST",
       body: JSON.stringify(dados),
       headers: {
        "Content-Type": "application/json"
       }

    })

    const resposta = await response.json()
    const token = await resposta.token
    if(token){
        localStorage.setItem("token", token)
        window.location.href = "/dashboard"
        return resposta.json()
    }
    return response.json()
} catch (error) {
    console.error("Erro ao enviar dados:", error)
    throw error
}
   
}

