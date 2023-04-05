const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

import DBM from './src/models/model';
import DBCM from './src/models/modelCards';

const app = express();
app.use(bodyParser.json());

const db_string = "mongodb+srv://marcosgabriel:mgmm4103@cluster0.7mnfxzs.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(db_string,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

function FormatedData(unix){
    unix = new Date(unix*1000).toLocaleString("pt-BR");
    return unix;
};


app.post('/', async (req, res) => {

    //! ATENÇÃO VARIAS REQUISIÇÕES AO BANCO DE DADOS, ISSO PODE DEIXAR A API LENTA. (VAI QUEBRAR).
    //* A TESTAR.

    let uid, data, permissao, sentido;
    for(let i=0; i<req.body.length;i++){
        
        uid = req.body[i].uid;
        data = req.body[i].data;
        sentido = req.body[i].sentido;
        permissao = req.body[i].permissao;

        console.log(`UID ${uid} ; DATA ${data} ; SENTIDO ${sentido} ; PERMISSAO ${permissao}`);
				try{
						DBM.findOneAndUpdate(
								{UID:uid},
								{$push: {
										HistoricoData: FormatedData(data),
										HistoricoSentido: sentido,
										HistoricoPermissao: permissao
								}}, async (err, documento) => {
										if(err){
												console.log(err);
										}else{
												if(i==req.body.length-1){
														console.log("Todos os documentos atualizados");
														return res.status(200).send("Operação feita com sucesso (CODE :200)");
												}; //caso queria ver o documento, so atualizar por "documento"
										}
								}
						);
				}catch(err){
						console.log(err);
						return res.status(-1).send("Erro interno do servidor");
				};
    }
});


app.get('/get', async (req, res) => {

    const data = await DBCM.findOne({ residencia:"residencia2216" }); 
    const luid = data.uids;

    let historico = [];
    for(let i=0; i<luid.length; i++){
        const uid_ = luid[i];
        historico.push(uid_);
    }

    const historicoJson = JSON.stringify(historico);
    console.log(historicoJson);
    res.send(historicoJson);

});

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Servidor Hospedado na Porta ${port}`);