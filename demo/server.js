/**
 * Created by demi on 7/28/15.
 */
var express = require('express');
var app = express();

app.use(express.static( __dirname ));

app.listen(3000);