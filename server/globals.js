// Modules you want available in the global namespace. Be EXTREMELY conservative on what you put
// here. Only low-level libraries which do not handle IO should be available in global namespace,
// the purpose being to decrease verbosity of code where those libraries are used.

global._ = require('lodash');

// Require from common library.
global._require = function(moduleName){
    return require('client/src/common/' + moduleName)
};

global.inject = _require('framework/inject');


if(process.env.NODE_ENV!=='production'){
    global.console.debug = global.console.log;
}

Path = require('path');

