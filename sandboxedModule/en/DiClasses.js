function Api(name, imports, injectedApis, injections, lookup) {
    this.resolved = false; // is dependencies computed?
    this.name = name || null; // file name and api name at the same time
    this.imports = imports || {}; // fields and functions that need to be injected 
    this.resolvedImport = {}; // partially computed context
    this.resolvedContext = {}; // context that will be injected to the file
    this.injections = injections || {};
    this.lookup = lookup || lookupType(name);

    if(typeof(injectedApis) === 'string') {
        injectedApis = [injectedApis];
    }
    this.injectedApis = injectedApis || [];
}

function lookupType(name) {
    if(name.startsWith('.')) {
        return 'LOCAL'
    } else {
        return 'GLOBAL'
    }
}

module.exports = {
    Api: Api,
    lookupType: lookupType
}

