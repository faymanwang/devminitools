import test from 'node:test';
import assert from 'node:assert/strict';
import {productionErrors,site} from '../scripts/site-content.mjs';
test('production requires a usable feedback channel and keeps advertising off',()=>{
    assert.match(productionErrors({...site,issuesEnabled:false,contactEmail:''}).join(' '),/feedback|Issues/);
    assert.deepEqual(productionErrors({...site,issuesEnabled:true,contactEmail:''}),[]);
    assert.deepEqual(productionErrors({...site,issuesEnabled:false,contactEmail:'maintainer@test-domain.cn'}),[]);
    assert.match(productionErrors({...site,issuesEnabled:true,adsEnabled:true}).join(' '),/advertising/);
});
