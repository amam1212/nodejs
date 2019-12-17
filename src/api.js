const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();


var StellarSdk = require('stellar-sdk')

var bodyParser = require('body-parser')


// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



router.post("/", (req, res) => {
  var json = req.body;
var transaction = new StellarSdk.Transaction(json.xdr,'Omplatform Stellar Network ; April 2019');
let code = null;
if( transaction.memo.value) {
  code = transaction.memo.value.toString()
}
var result =  StellarSdk.Utils.verifyTxSignedBy(transaction,json.publicKey);


const data = {
  'publicKey': json.publicKey,
  'checkSignature': result,
  'code': code
}

res.json(data);
});

app.use(`/.decode`, router);

module.exports = app;
module.exports.handler = serverless(app);
