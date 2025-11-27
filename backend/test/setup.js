process.env.NODE_ENV = 'test';
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

// Helper to reset stubs between tests
function restoreStubs(stubs){
  if(!stubs) return;
  stubs.forEach(s=>{ try{ s.restore(); }catch(e){} });
}

module.exports = { sinon, expect, restoreStubs };
