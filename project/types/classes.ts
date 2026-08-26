export type user = {
    id: string
    nome: string
    email: string
    senha: string
    tipoEmpresa: string
}

export type userPayload = Pick<user, "nome" | "email" |"senha" | "tipoEmpresa">
export type loginPayload = Pick<user, "email" | "senha">