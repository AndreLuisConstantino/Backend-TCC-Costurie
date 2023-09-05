/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client')

var prisma = new PrismaClient()

const insertUsuarioModel = async (dadosUsuario) => {
    let sql = `insert into tbl_usuario(nome_de_usuario, email, senha) values ('${dadosUsuario.nome_de_usuario}', '${dadosUsuario.email}', '${dadosUsuario.senha}');`

    
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus) {
        return true
    } else {
        return false
    }
}

//Retorna o ultimo id inserido pelo banco de dados
const selectLastIDModel = async () => {

    let sql = `select 
                    tbl_usuario.id as id_usuario, 
                    tbl_usuario.nome_de_usuario as tag_usuario, 
                    tbl_usuario.email  
                from tbl_usuario order by id desc limit 1;`

    let rsAluno = await prisma.$queryRawUnsafe(sql)

    if(rsAluno.length > 0){
        return rsAluno
    } else {
        return false
    }

}

const selectUserByLoginModel = async (dadosLogin) => {
    let sql = `select tbl_usuario.id ,tbl_usuario.nome_de_usuario, tbl_usuario.email from tbl_usuario where tbl_usuario.email = '${dadosLogin.email}' and tbl_usuario.senha = '${dadosLogin.senha}'`

    let response = await prisma.$queryRawUnsafe(sql)

    if(response.length > 0){
        return response
    } else {
        return false
    }
}

const selectUserByEmail = async (email) => {
    let sql = `select tbl_usuario.id, tbl_usuario.nome_de_usuario, tbl_usuario.email from tbl_usuario where tbl_usuario.email = '${email}';`

    let rsAluno = await prisma.$queryRawUnsafe(sql)

    if(rsAluno.length > 0){
        return true
    } else {
        return false
    }
}

module.exports = {
    insertUsuarioModel,
    selectLastIDModel,
    selectUserByLoginModel,
    selectUserByEmail
}