import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {pageRegistry} from '../scripts/site-content.mjs';
test('static generation is repeatable and all language pairs have clean URLs',()=>{
    const files=[...pageRegistry().map(p=>p.file),'sitemap.xml','robots.txt'];
    const before=files.map(f=>readFileSync(f,'utf8'));
    const run=spawnSync(process.execPath,['scripts/generate-i18n.mjs'],{encoding:'utf8'});assert.equal(run.status,0,run.stderr);
    files.forEach((f,i)=>assert.equal(readFileSync(f,'utf8'),before[i],f));
    const check=spawnSync(process.execPath,['scripts/check-site.mjs'],{encoding:'utf8'});assert.equal(check.status,0,check.stderr);
});
