const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

//definindo o modelo Residente
const Residente = mongoose.model('residentes', {
  uid: String,
  nome: String,
  cpf: String,
  data_nascimento: String,
  sexo: String,
  email: String,
  telefone: String,
  contato_emergencia_nome: String,
  contato_emergencia_parentesco: String,
  contato_emergencia_telefone: String,
  rua: String,
  numero: String,
  bairro: String,
  cep: String,
  cidade: String,
  estado: String,
  residencia: [String],
  apartamento: [String],
  numero_quarto: [String],
  data_entrada: [String],
  data_saida: [String],
  acesso: String,
  historico_data: [String],
  historico_sentido: [String],
  historico_permissao: [String],
});

const Cartoes = mongoose.model('cartoes', {
  residencia:String,
  objects:[{
          uid:String,
          nome:String
  }]
});

const app = express();
app.use(bodyParser.json());

const db_string = "mongodb+srv://Kauan_Prog:Kauandbs159753.@garu.fwrnoix.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(db_string,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/post', async (req, res) => {
  
  for (let i=0; i<req.body.length; i++){
    
    const { uid, data, sentido, permissao } = req.body[i];
    
    //let reversed_uid = uid.match(/.{1,2}/g).reverse().join('');

    console.log(`\n${i+1}: ${uid}; ${data}; ${sentido}; ${permissao}`);
    try {
      await Residente.findOneAndUpdate(
        { uid:uid },
        { $push: {
            historico_data: data,
            historico_sentido: sentido,
            historico_permissao: permissao
          }
        }
      )
          
      console.log("Documento atualizado com sucesso");
      if(i==req.body.length-1){res.status(200).send("OK");}
    } catch (err) {
      console.log(err);
      res.status(500).send("Erro interno do servidor");
    }
  }
});


app.get('/get', async (req, res) => {
  try {
    const dispositivo = req.query.residencia;
    const data = await Cartoes.findOne({ residencia: dispositivo }).exec();
    const obj = data.objects;

    let historico = [];
    for (let i = 0; i < obj.length; i++) {
      let new_data = {};
      const uid_ = obj[i].uid;
      const _name = obj[i].nome;

      new_data['uid'] = uid_;
      new_data['name'] = _name;

      historico.push(new_data);
    }

    const historicoJson = JSON.stringify(historico);
    console.log(historicoJson);
    res.send(historicoJson);
    
  } catch (err) {
    console.log(err);
    return res.status(-1).send("Erro interno do servidor");
  }
});


const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Servidor Hospedado na Porta ${port}`);
