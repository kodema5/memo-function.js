
// ref: https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
//
let STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
let ARGUMENT_NAMES = /([^\s,]+)/g;
function getArgNames(func) {
    if (typeof(func)!=="function") return []

    let fnStr = func
        .toString()
        .replace(STRIP_COMMENTS, '')
    let arr = fnStr
        .slice(fnStr.indexOf('(')+1, fnStr.indexOf(')'))
        .match(ARGUMENT_NAMES);
    return arr ?? []
}

// query object for path
//
let queryArg = (obj, path) => {
    if (!obj || typeof obj !== 'object') return

    let n = path.length
    if (n===0) return

    var cur = obj
    var val = undefined
    for (let n of path) {
        if (!cur.hasOwnProperty(n)) {
            val = undefined
            break
        }
        val = cur = cur[n]
    }
    return val
}

// query for each names
//
let queryArgs = (
    ctx,
    names,
    delimiter='$', // valid var-names is [a-zA-Z0-9_$]
) => {
    return Array
        .from(names)
        .map(n => n.split(delimiter).filter(Boolean))
        .filter(Boolean)
        .map(ns => queryArg(ctx, ns))
}


// check if same
//
let equalArgs = (args1, args2) => {

    if (args1.length!==args2.length) return false

    return args1.every((a, i) => {
        let b = args2[i]
        return typeof(a) == 'object'
            ? a == b // check pointer only
            : a === b
    })
}


// caches last output
//
export class MemoFunction {

    constructor(func) {
        this.func = func
        this.argNames = getArgNames(func)
    }

    call(thisArg) {

        if (this.argNames.length===0) {
            return this.func.call(thisArg)
        }

        if (arguments.length===0) {
            return this.curOutput
        }

        return this.apply(
            thisArg,
            queryArgs(thisArg, this.argNames))
    }

    apply(thisArg, args) {

        let f = (arguments.length === 0)
            || (
                this.curArgs
                && equalArgs(args, this.curArgs)
            )
        if (f) return this.curOutput


        this.curArgs = args
        this.curOutput = this.func.apply(thisArg, args)
        return this.curOutput
    }
}