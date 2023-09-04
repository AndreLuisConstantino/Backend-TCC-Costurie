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
    let sql = ``

    let rsAluno = await prisma.$queryRawUnsafe(sql)

    if(rsAluno.length > 0){
        return rsAluno
    } else {
        return false
    }
}

module.exports = {
    insertUsuarioModel,
    selectLastIDModel,
    selectUserByLoginModel
}