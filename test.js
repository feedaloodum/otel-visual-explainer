const assert = require('assert');
const { getResourceAttributes, getSignalTypes } = require('./otel-logic.js');

// Test runner
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('\n=== OTel Visual Explainer — Tests ===\n');

// --- getResourceAttributes ---
console.log('getResourceAttributes:');

test('returns an array', () => {
  const result = getResourceAttributes();
  assert.ok(Array.isArray(result), 'should return an array');
});

test('includes service.name', () => {
  const result = getResourceAttributes();
  const serviceName = result.find(a => a.name === 'service.name');
  assert.ok(serviceName, 'service.name should be present');
});

test('service.name is required', () => {
  const result = getResourceAttributes();
  const serviceName = result.find(a => a.name === 'service.name');
  assert.strictEqual(serviceName.required, true, 'service.name should be required');
});

test('includes service.instance.id', () => {
  const result = getResourceAttributes();
  const found = result.find(a => a.name === 'service.instance.id');
  assert.ok(found, 'service.instance.id should be present');
});

test('includes host.name', () => {
  const result = getResourceAttributes();
  const found = result.find(a => a.name === 'host.name');
  assert.ok(found, 'host.name should be present');
});

test('each attribute has name, type, description, required', () => {
  const result = getResourceAttributes();
  for (const attr of result) {
    assert.ok('name' in attr, `${JSON.stringify(attr)} missing name`);
    assert.ok('type' in attr, `${attr.name} missing type`);
    assert.ok('description' in attr, `${attr.name} missing description`);
    assert.ok('required' in attr, `${attr.name} missing required`);
  }
});

test('returns at least 5 attributes', () => {
  const result = getResourceAttributes();
  assert.ok(result.length >= 5, `expected >= 5 attributes, got ${result.length}`);
});

// --- getSignalTypes ---
console.log('getSignalTypes:');

test('returns an array', () => {
  const result = getSignalTypes();
  assert.ok(Array.isArray(result), 'should return an array');
});

test('returns exactly 3 signal types', () => {
  const result = getSignalTypes();
  assert.strictEqual(result.length, 3, `expected 3 signals, got ${result.length}`);
});

test('includes traces', () => {
  const result = getSignalTypes();
  const traces = result.find(s => s.id === 'traces');
  assert.ok(traces, 'traces should be present');
});

test('includes metrics', () => {
  const result = getSignalTypes();
  const metrics = result.find(s => s.id === 'metrics');
  assert.ok(metrics, 'metrics should be present');
});

test('includes logs', () => {
  const result = getSignalTypes();
  const logs = result.find(s => s.id === 'logs');
  assert.ok(logs, 'logs should be present');
});

test('each signal has id, name, description', () => {
  const result = getSignalTypes();
  for (const sig of result) {
    assert.ok('id' in sig, `${JSON.stringify(sig)} missing id`);
    assert.ok('name' in sig, `${sig.id} missing name`);
    assert.ok('description' in sig, `${sig.id} missing description`);
  }
});

// --- Summary ---
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) {
  process.exit(1);
}