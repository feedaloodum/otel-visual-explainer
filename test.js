const assert = require('assert');
const { getResourceAttributes, getSignalTypes, getTraceSchema, getSpanFields } = require('./otel-logic.js');

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

// --- getTraceSchema ---
console.log('getTraceSchema:');

test('returns an object with hierarchy', () => {
  const result = getTraceSchema();
  assert.ok(typeof result === 'object', 'should return an object');
  assert.ok('resource' in result, 'should have resource level');
  assert.ok('instrumentationScope' in result, 'should have instrumentationScope level');
  assert.ok('span' in result, 'should have span level');
});

test('instrumentationScope has name and version', () => {
  const result = getTraceSchema();
  const is = result.instrumentationScope;
  assert.ok('name' in is, 'instrumentationScope missing name');
  assert.ok('version' in is, 'instrumentationScope missing version');
});

// --- getSpanFields ---
console.log('getSpanFields:');

test('returns an array', () => {
  const result = getSpanFields();
  assert.ok(Array.isArray(result), 'should return an array');
});

test('includes traceId', () => {
  const result = getSpanFields();
  const found = result.find(f => f.name === 'traceId');
  assert.ok(found, 'traceId should be present');
});

test('includes spanId', () => {
  const result = getSpanFields();
  const found = result.find(f => f.name === 'spanId');
  assert.ok(found, 'spanId should be present');
});

test('includes parentSpanId', () => {
  const result = getSpanFields();
  const found = result.find(f => f.name === 'parentSpanId');
  assert.ok(found, 'parentSpanId should be present');
});

test('includes spankind', () => {
  const result = getSpanFields();
  const found = result.find(f => f.name === 'kind');
  assert.ok(found, 'kind (spankind) should be present');
  assert.ok('enumValues' in found, 'kind should have enumValues');
  const enumVals = found.enumValues;
  assert.ok(enumVals.includes('INTERNAL'), 'should include INTERNAL');
  assert.ok(enumVals.includes('SERVER'), 'should include SERVER');
  assert.ok(enumVals.includes('CLIENT'), 'should include CLIENT');
  assert.ok(enumVals.includes('PRODUCER'), 'should include PRODUCER');
  assert.ok(enumVals.includes('CONSUMER'), 'should include CONSUMER');
});

test('includes startTime and endTime', () => {
  const result = getSpanFields();
  const start = result.find(f => f.name === 'startTimeUnixNano');
  const end = result.find(f => f.name === 'endTimeUnixNano');
  assert.ok(start, 'startTimeUnixNano should be present');
  assert.ok(end, 'endTimeUnixNano should be present');
});

test('includes attributes', () => {
  const result = getSpanFields();
  const found = result.find(f => f.name === 'attributes');
  assert.ok(found, 'attributes should be present');
});

test('includes events', () => {
  const result = getSpanFields();
  const found = result.find(f => f.name === 'events');
  assert.ok(found, 'events should be present');
});

test('includes links', () => {
  const result = getSpanFields();
  const found = result.find(f => f.name === 'links');
  assert.ok(found, 'links should be present');
});

test('includes status', () => {
  const result = getSpanFields();
  const found = result.find(f => f.name === 'status');
  assert.ok(found, 'status should be present');
});

test('each field has name, type, description, required', () => {
  const result = getSpanFields();
  for (const f of result) {
    assert.ok('name' in f, `${JSON.stringify(f)} missing name`);
    assert.ok('type' in f, `${f.name} missing type`);
    assert.ok('description' in f, `${f.name} missing description`);
    assert.ok('required' in f, `${f.name} missing required`);
  }
});

test('returns at least 10 span fields', () => {
  const result = getSpanFields();
  assert.ok(result.length >= 10, `expected >= 10 fields, got ${result.length}`);
});

// --- Summary ---
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) {
  process.exit(1);
}