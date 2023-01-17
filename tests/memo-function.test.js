import { assert } from "https://deno.land/std@0.157.0/testing/asserts.ts";
import { MemoFunction } from '../mod.js'

Deno.test('memo function', () => {
    var n = 0
    let mf = new MemoFunction((a,b) => { n++; return a+b  })

    assert(mf.call({a:1,b:2}) === 3)
    assert(n===1)

    // without param change
    //
    assert(mf.call({a:1,b:2}) === 3)
    assert(n===1)

    // without param returns last
    //
    assert(mf.call() === 3)
    assert(n===1)

    // only when param changed
    //
    assert(mf.call({a:2,b:2}) === 4)
    assert(n===2)

})

Deno.test('parameterless memo function always got called', () => {
    var n = 0
    let mf = new MemoFunction(() => { return ++n })

    assert(mf.call() === 1)
    assert(mf.call() === 2)
    assert(mf.call() === 3)
})


