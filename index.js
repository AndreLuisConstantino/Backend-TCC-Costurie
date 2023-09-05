/*****************************************************************************
 * Objetivo: Criar uma API para o TCC Costuriê
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

/* 
    Padronizacão de commit -> "DATA [Feature implementada]"
*/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require('./controller/modulo/config.js')

/*
    Import das depenencias do projeto
*/
//Dependencia para criar as requisições da API
const express = require('express')
//Dependencia para gerenciar as permissões da API
const cors = require('cors')
//Dependencia para gerenciar o corpo de requisições da API
const bodyParser = require('body-parser')

/* Imports Controllers */
const usuarioController = require('./controller/usuarioController.js')

//Cria um objeto com as características do expresponses
const app = express()

//Permissões do cors
app.use((request, response, next) => {
    //Define quem poderá acessar a API (* = Todos)
    response.header('Acess-Control-Allow-Origin', '*')
    //Define quais métodos serão utilizados na API
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    //Atribui as permissões ao Cors
    app.use(cors())

    next()
})

//Define que os dados que iram chegar na requisição será no padrão JSON
const bodyParserJSON = bodyParser.json()

//Instanciacão de um servidor em http e a criacão de um IO
const server = require('http').createServer(app);
const io = require('socket.io')(server);

    //Receber o token encaminhado nas requisicões e solicitar a validacão
    const verifyJWT = async (request, response, next) => {
        const jwt = require('./middleware/middlewareJWT.js')

        let token = request.headers['x-access-token']

        const autenticidadeToken = await jwt.validateJWT(token)

        if(autenticidadeToken) {
            next()
        } else {
            return response.status(401).end()
        }
    }

    /* Usuário */
    //Endpoint para cadastrar um Usuário 
    app.post('/usuario/cadastro', verifyJWT,cors(), bodyParserJSON, async (request, response) => {
        let contentType = request.headers['content-type']

        if (String(contentType).toLowerCase() == 'application/json') {
            //Recebe os dados encaminhados na requisição
            let dadosBody = request.body

            let resultDadosUsuario = await usuarioController.insertUsuario(dadosBody)

            response.status(resultDadosUsuario.status)
            response.json(resultDadosUsuario)
        } else {
            response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
            response.json(message.ERROR_INVALID_CONTENT_TYPE)
        }
    })

    //Endpoint para autenticar o Usuário
    app.get('/usuario/login', cors(), bodyParserJSON,async (request, response) => {
        let contentType = request.headers['content-type']

        if (String(contentType).toLowerCase() == 'application/json') {
            let dadosLogin = request.body

            let token = request.headers['x-access-token'] 

            let dadosResponseLogin = await usuarioController.selectUserByLogin(dadosLogin)
            if(dadosResponseLogin) {
                response.status(dadosResponseLogin.status)
                response.json(dadosResponseLogin)
            } else {
                response.status(400)
                response.json({message: 'Não foi possivel fazer o Login'})
            }    
        } else {
            response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
            response.json(message.ERROR_INVALID_CONTENT_TYPE)
        }
    })

    app.get('/usuario/token', verifyJWT, cors(), bodyParserJSON, async (request, response) => {
        response.status(200)
        response.json({'Validate': 'Validado, pode usar o app ;)', status: true})
    })

app.listen(3000, () => console.log('Servidor rodando na porta 8080'))