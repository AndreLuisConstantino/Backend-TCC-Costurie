/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('../controller/modulo/config.js')

/* Imports Models */
const usuarioModel = require('../model/usuarioModel.js')

const insertUsuario = async (dadosUsuario) => {

    if (dadosUsuario.nome_de_usuario == '' || dadosUsuario.nome_de_usuario == undefined || dadosUsuario.nome_de_usuario.lenght > 100 ||
        dadosUsuario.email == '' || dadosUsuario.email == undefined || dadosUsuario.email.length > 255 ||
        dadosUsuario.senha == '' || dadosUsuario.senha == undefined || dadosUsuario.senha.length > 515) {

            return message.ERROR_REQUIRED_FIELDS   

    } else {

        let resultEmail = await usuarioModel.selectUserByEmailModel(dadosUsuario.email)

        if (resultEmail) {
            return message.ERROR_EMAIL_ALREADY_EXISTS
        } else {
            
            let resultDadosUsuario = await usuarioModel.insertUsuarioModel(dadosUsuario)

            //Valida se o BD inseriu corretamente os dados
            if (resultDadosUsuario) {

                //Chama a função que vai encontrar o ID gerado após o inser
                let novoUsuario = await usuarioModel.selectLastIDModel()

                let dadosUsuarioJson = {}
                dadosUsuarioJson.status = message.SUCCESS_CREATED_ITEM.status
                dadosUsuarioJson.aluno = novoUsuario

                return dadosUsuarioJson //StatusCode 201
            } else {
                return message.ERROR_INTERNAL_SERVER //StatusCode 500
            }
        }

        
    }
}

const selectUserByLogin = async (dadosLogin) => {

    if (dadosLogin.email == '' || dadosLogin.email == undefined || dadosLogin.email.length > 255 ||
        dadosLogin.senha == '' || dadosLogin.senha == undefined || dadosLogin.senha.lenght > 515) {
            return message.ERROR_REQUIRED_FIELDS
    } else {

        //Import JWT
        const jwt = require('../middleware/middlewareJWT.js')

        let login = await usuarioModel.selectUserByLoginModel(dadosLogin)

        if (login) {
            //Gera o token pelo jwt
            let tokenUser = await jwt.createJWT(login[0].id)

            let dadosLoginJson = {}
            dadosLoginJson.login = login
            dadosLoginJson.status = 200
            dadosLoginJson.token = tokenUser
            return dadosLoginJson
        } else {
            return message.ERROR_ITEM_NOT_FOUND
        }
    }
}

const getUserByEmail = async (dadosEmail) => {

    let resultEmail = await usuarioModel.selectUserByEmailModel(dadosEmail)

    if (resultEmail) {
        let dadosEmailJson = {}
        dadosEmailJson.email = resultEmail
        return dadosEmailJson
    } else {
        return false
    }
}

module.exports = {
    insertUsuario,
    selectUserByLogin,
    getUserByEmail
}