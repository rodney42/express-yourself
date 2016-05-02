
var rgb_query_parameter = {
  r : { type : "INT", default: 0, description : "Red color part"},
  g : { type : "INT", default: 0, description : "Green color part"},
  b : { type : "INT", default: 0, description : "Blue color part"}
};

// Example definition
var def = {
  blink : 
    path: "blink/:id",
    description : "Let the LEDs blink service.",
    parameter : {
      id : { type : "INT", description : "LED Identifier", path:true }
    },
    endpoints : {
      off : {
        description : "Switch LED off.",
        use : echo
      },
      script: {
        path : "script/:scriptid",
        description : "Executes a pre-defined script",
        parameter : {
          scriptid : { type : "INT", description : "Script ID", path : true }
        },
        use : echo
      },
      rgb: {
        description : "Switch to rgb color",
        parameter : rgb_query_parameter,
        use : echo
      },
      fade: {
        description : "Fade to rgb color",
        parameter : rgb_query_parameter,
        use : echo
      }
    }
  }
};

function echo( req, res ) {
  res.send( req.endpoint );
}

var express     = require('express');
var api = require('./express-yourself.js');
var app = express();

api.use(app, def);

app.listen(3000, function () {
  console.log('Self api app listening on port 3000!');
});

*/
