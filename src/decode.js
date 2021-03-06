const express = require("express");
const serverless = require("serverless-http");
var StellarSdk = require('stellar-sdk')

var bodyParser = require('body-parser');
const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



router.post("/", (req, res) => {
  try {

    var json = req.body;


    var url = 'https://api.omchain.network/';
    var nertworkPasspharse = 'Omplatform Stellar Network ; April 2019';





      if (json.hasOwnProperty('network')) {

        if (json.network === 'TESTNET') {
          url = 'https://horizon-testnet.stellar.org';
          nertworkPasspharse = 'Test SDF Network ; September 2015';
        }

      }


    var server = new StellarSdk.Server(url);
    var transaction = new StellarSdk.Transaction(json.xdr, nertworkPasspharse);



    let code = null;
    if (transaction.memo.value) {
      code = transaction.memo.value.toString()
    }
    var result = StellarSdk.Utils.verifyTxSignedBy(transaction, json.publicKey);


    const data = {
      'publicKey': json.publicKey,
      'checkSignature': result,
      'passcode': code,
      'code': 200
    }
    res.json(data);
  }catch (e) {


    const data = {
      'message': `XDR or Public Key are not incorrect`,
      'code': 500
    }
    res.json(data);

  }
});

app.use(`/.netlify/functions/decode`, router);

module.exports = app;
module.exports.handler = serverless(app);

