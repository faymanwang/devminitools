import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const safety=createRequire(import.meta.url)('../js/input-safety.js');
test('unsafe numeric literals are rejected while quoted IDs survive',()=>{
    for(const text of ['{"id":9007199254740993}','{"n":1e400}','{"n":9.007199254740993e15}'])assert.throws(()=>safety.parseJson(text,false),/安全精度/);
    assert.throws(()=>safety.parseJson('{"id":9007199254740993}',true),/safe precision/);
    assert.equal(safety.parseJson('{"id":"9007199254740993","n":42}',false).id,'9007199254740993');
    assert.deepEqual(safety.parseJson('[true,null,"escaped \\\"123\\\""]',true),[true,null,'escaped "123"']);
    assert.throws(()=>safety.parseJson('{"n":1,}',true));
});
test('image limits reject invalid constraints and preserve aspect ratio without upscaling',()=>{
    assert.deepEqual(safety.dimensions(640,480,'320','',false),{width:320,height:240});
    assert.deepEqual(safety.dimensions(640,480,'1920','1920',true),{width:640,height:480});
    for(const value of ['0','-1','1.5','NaN'])assert.throws(()=>safety.dimensions(640,480,value,'',true),/positive integers/);
});
test('image export rejects MIME fallback and missing blobs',async()=>{
    const blob={type:'image/webp',size:10};
    assert.equal(await safety.imageBlob({toBlob:cb=>cb(blob)},'image/webp',0.8,true),blob);
    await assert.rejects(safety.imageBlob({toBlob:cb=>cb({type:'image/png'})},'image/webp',0.8,true),/cannot export/);
    await assert.rejects(safety.imageBlob({toBlob:cb=>cb(null)},'image/png',undefined,false),/无法导出/);
});
test('IPv6 validation requires a complete address',()=>{
    const s=readFileSync('js/ip-lookup.js','utf8');const a=s.indexOf('    function isIpv6('),b=s.indexOf('    function ipv4Type(',a);
    const valid=vm.runInNewContext(s.slice(a,b)+'\nisIpv6',{URL});
    for(const ip of ['::','::1','2001:db8::1','::ffff:192.0.2.1'])assert.equal(valid(ip),true,ip);
    for(const ip of ['1:2','1:2:3:4:5:6:7','1::2::3','gg::1','fe80::1%eth0','::1]/path'])assert.equal(valid(ip),false,ip);
});
