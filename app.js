var express = require('express');
var app = express();
var bodyParser = require('body-parser');
jsSHA = require('./scripts/sha');

app.get('/api/token', function(req, res) {
    var header=req.headers['authorization'];
    var token=header.split(/\s+/).pop();
    auth=new Buffer(token, 'base64').toString();
    parts=auth.split(/:/);
    username=parts[0];
    password=parts[1];
    var respuesta = new Object();
    if(username == 'franco' && password == '123456'){
      respuesta.value = true;
      respuesta.token = generateToken(req.query.user);
    }
    else {
      respuesta.value = false;
      respuesta.message = 'Usuario o contraseña incorrecto';
    }
    res.json(respuesta);
  });
app.listen(3000);
console.log('running on port 3000');


function generateToken(userName) {
    var EPOCH_SECONDS = 62167219200;
    var key = "a0fe73330da64709a769272ef597ba23";
    var appID = "8f70c2.vidyo.io";
    var expiresInSeconds = 3600;
    var expires = Math.floor(Date.now() / 1000) + expiresInSeconds + EPOCH_SECONDS;
    var shaObj = new jsSHA("SHA-384", "TEXT");
    shaObj.setHMACKey(key, "TEXT");
    jid = userName + '@' + appID;
    var body = 'provision' + '\x00' + jid + '\x00' + expires + '\x00';
    shaObj.update(body);
    var mac = shaObj.getHMAC("HEX");
    var serialized = body + '\0' + mac;
    console.log("Genere Token para: " + userName);
    return new Buffer(serialized).toString('base64');
}
