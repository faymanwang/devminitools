import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n').replace(/\s+/g,' ').trim()).digest('hex');
test('main baseline stylesheet and every existing page header are preserved',()=>{
    const baseline=JSON.parse(readFileSync('tests/fixtures/layout-main.json','utf8'));
    assert.equal(hash(readFileSync('css/style.css','utf8')),baseline.stylesheet);
    for(const [file,expected]of Object.entries(baseline.headers))assert.equal(hash(readFileSync(file,'utf8').match(/<header\b[\s\S]*?<\/header>/)[0]),expected,file);
});
