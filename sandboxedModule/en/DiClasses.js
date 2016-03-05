function Api(name, imports, injectedApis) {
    if(typeof(name) === '
    this.resolved = false; // is dependencies computed?
    this.name = name || null; // file name and api name at the same time
    this.imports = imports || {}; // fields and functions that need to be injected 
    this.resolvedImport = {}; // partially computed context
    this.resolvedContext = {}; // context that will be injected to the file
}

module.exports {
    Api: Api,
}

