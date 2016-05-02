var registry = []
exports.registry = registry;

/**
 * Register a definition.
 *
 * @param app  The express application.
 * @param def  The api definition.
 */
exports.use = function(app,def) {
  registerDefinition(app,{
    _registry : {
      description : "Registry self describing service",
      endpoints : {
          get : {
            path : '',
            use : function getRegistry(req,res) {
             res.send( registry );
            }
          }
        }
    }
  });

  registerDefinition(app,def);
}

/**
 * Register a definition.
 *
 * @param app  The express application.
 * @param def  The api definition.
 */
function registerDefinition(app,def) {
  for( var service in def ) {

    if( !def[service].endpoints ) {
      throw new Error('No use endpoints defined in service '+service);
    }

    var servicedefinition = {
      key : service,
      path : def[service].path,
      description : def[service].description,
      endpoints : []
    }

    if( !servicedefinition.path ) servicedefinition.path = service;

    for( var endpoint in def[service].endpoints ) {
      servicedefinition.endpoints.push( registerEndpoint(app, {
          service     : servicedefinition,
          service_raw : def[service],
          endpointkey : endpoint,
          endpoint    : def[service].endpoints[endpoint]
      } ) );
    }

    registry.push( servicedefinition );

  }
}

/**
 * Register a endpint.
 *
 * @param app  The express application.
 * @param def  The api definition.
 */
function registerEndpoint(app,def) {

  if( !def.endpoint.use ) {
    throw new Error('No use function defined in endpoint '+def.endpointkey);
  }
  var endpointDefinition = {
    method : def.endpoint.method || 'GET',
    description : def.endpoint.description,
    path : def.endpoint.path || def.endpointkey,
    parameter : []
  };

  // Determine path
  endpointDefinition.fullpath = '/'+ def.service.path;
  if( def.endpoint.path !== undefined ) {
    if( def.endpoint.path.length>0 ) {
      endpointDefinition.path = def.endpoint.path;
      endpointDefinition.fullpath += '/'+ endpointDefinition.path;
    }
  } else {
    endpointDefinition.path = def.endpointkey;
    endpointDefinition.fullpath += '/'+ endpointDefinition.path;
  }

  // Determine parameter
  var allparams = collect(def.service_raw.parameter, def.endpoint.parameter);
  for( var param in allparams ) {
    endpointDefinition.parameter.push({
      name        : param,
      type        : allparams[param].type || "STRING",
      description : allparams[param].description,
      path        : allparams[param].path || false
    });
  }
  console.log('registered endpoint : '+endpointDefinition.method+' '+endpointDefinition.fullpath+' uses '+def.endpoint.use.name);

  app.get( endpointDefinition.fullpath, function(req, res)  {
    req.endpoint = endpointDefinition;
    def.endpoint.use(req, res);
  });

  return endpointDefinition;

};


function collect() {
  var ret = {};
  var len = arguments.length;
  for (var i=0; i<len; i++) {
    for (var p in arguments[i]) {
      if (arguments[i].hasOwnProperty(p)) {
        ret[p] = arguments[i][p];
      }
    }
  }
  return ret;
}
