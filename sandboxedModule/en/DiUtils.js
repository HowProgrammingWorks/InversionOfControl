function decorate(func, before, after, arg) {
  return function() {
      arg(arguments);
      if(before) before.apply(this, arguments);
      func.apply(this, arguments);
      if(after) after.apply(this, arguments);
  }
}

function combine(before, after, arg) {
    return function() {
        if(arg) arg(arguments);
        if(before) before.apply(this, arguments);
        if(after) after.apply(this, arguments);
    }
}

function copy(dest, src) {
    if(typeof(src) === 'object' && typeof(dest) == 'object') {
        for(key in src) {
            dest[key] = src[key];
        }
    }
}

function merge() {
    var merged = {};
    for(var i in arguments) {
        copy(merged, arguments[i]);
    } 
    return merged;
}

module.exports = {
    decorate: decorate,
    combine: combine, 
    merge: merge
}
