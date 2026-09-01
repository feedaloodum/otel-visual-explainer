const assert = require('assert');
const { getResourceAttributes, getSignalTypes, getTraceSchema, getSpanFields, getFieldMetadata, getSpanRelationships, getMetricFields, getLogFields } = require('./otel-logic.js');

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

// --- getFieldMetadata ---
console.log('getFieldMetadata:');

test('returns metadata for traces.traceId', () => {
  const result = getFieldMetadata('traces', 'traceId');
  assert.ok(result, 'should return a result');
  assert.strictEqual(result.name, 'traceId');
  assert.ok('type' in result, 'should have type');
  assert.ok('description' in result, 'should have description');
});

test('returns metadata for traces.kind with enumValues', () => {
  const result = getFieldMetadata('traces', 'kind');
  assert.ok(result, 'should return a result');
  assert.ok('enumValues' in result, 'should have enumValues');
  assert.ok(result.enumValues.includes('SERVER'), 'should include SERVER');
});

test('returns null for unknown field', () => {
  const result = getFieldMetadata('traces', 'nonexistent');
  assert.strictEqual(result, null, 'should return null for unknown field');
});

test('returns null for unknown signal type', () => {
  const result = getFieldMetadata('unknown', 'traceId');
  assert.strictEqual(result, null, 'should return null for unknown signal');
});

// --- getSpanRelationships ---
console.log('getSpanRelationships:');

test('returns parent and children for a span', () => {
  const result = getSpanRelationships('span-b');
  assert.ok(result, 'should return a result');
  assert.ok('parent' in result, 'should have parent');
  assert.ok('children' in result, 'should have children');
  assert.ok(Array.isArray(result.children), 'children should be array');
});

test('root span has null parent', () => {
  const result = getSpanRelationships('span-a');
  assert.strictEqual(result.parent, null, 'root span should have null parent');
  assert.ok(result.children.length > 0, 'root span should have children');
});

test('leaf span has empty children', () => {
  const result = getSpanRelationships('span-d');
  assert.ok(result.parent, 'leaf span should have a parent');
  assert.strictEqual(result.children.length, 0, 'leaf span should have no children');
});

test('returns null for unknown span', () => {
  const result = getSpanRelationships('nonexistent');
  assert.strictEqual(result, null, 'should return null for unknown span');
});

// --- getMetricFields ---
console.log('getMetricFields:');

test('returns an array', () => {
  const result = getMetricFields();
  assert.ok(Array.isArray(result), 'should return an array');
});

test('includes Counter', () => {
  const result = getMetricFields();
  const found = result.find(m => m.name === 'Counter' || m.type === 'Counter');
  assert.ok(found, 'Counter should be present');
});

test('includes Gauge', () => {
  const result = getMetricFields();
  const found = result.find(m => m.name === 'Gauge' || m.type === 'Gauge');
  assert.ok(found, 'Gauge should be present');
});

test('includes Histogram', () => {
  const result = getMetricFields();
  const found = result.find(m => m.name === 'Histogram' || m.type === 'Histogram');
  assert.ok(found, 'Histogram should be present');
});

test('includes Exponential Histogram', () => {
  const result = getMetricFields();
  const found = result.find(m => m.name === 'Exponential Histogram' || m.type === 'Exponential Histogram' || m.name === 'ExponentialHistogram' || m.type === 'ExponentialHistogram');
  assert.ok(found, 'Exponential Histogram should be present');
});

test('includes Summary', () => {
  const result = getMetricFields();
  const found = result.find(m => m.name === 'Summary' || m.type === 'Summary');
  assert.ok(found, 'Summary should be present');
});

test('returns at least 5 metric types', () => {
  const result = getMetricFields();
  assert.ok(result.length >= 5, `expected >= 5 metric types, got ${result.length}`);
});

test('each metric type has name, type, description, required, fields', () => {
  const result = getMetricFields();
  for (const m of result) {
    assert.ok('name' in m, `${JSON.stringify(m)} missing name`);
    assert.ok('type' in m, `${m.name} missing type`);
    assert.ok('description' in m, `${m.name} missing description`);
    assert.ok('required' in m, `${m.name} missing required`);
    assert.ok('fields' in m, `${m.name} missing fields`);
    assert.ok(Array.isArray(m.fields), `${m.name} fields should be an array`);
  }
});

test('each metric sub-field has name, type, description, required', () => {
  const result = getMetricFields();
  for (const m of result) {
    for (const f of m.fields) {
      assert.ok('name' in f, `${m.name}.${JSON.stringify(f)} missing name`);
      assert.ok('type' in f, `${m.name}.${f.name} missing type`);
      assert.ok('description' in f, `${m.name}.${f.name} missing description`);
      assert.ok('required' in f, `${m.name}.${f.name} missing required`);
    }
  }
});

test('each metric type has timestamp field', () => {
  const result = getMetricFields();
  for (const m of result) {
    const ts = m.fields.find(f => f.name === 'timestamp' || f.name === 'timeUnixNano' || f.name === 'startTimeUnixNano');
    assert.ok(ts, `${m.name} should have a timestamp field`);
  }
});

test('each metric type has attributes field', () => {
  const result = getMetricFields();
  for (const m of result) {
    const attr = m.fields.find(f => f.name === 'attributes');
    assert.ok(attr, `${m.name} should have an attributes field`);
  }
});

// --- getLogFields ---
console.log('getLogFields:');

test('returns an array', () => {
  const result = getLogFields();
  assert.ok(Array.isArray(result), 'should return an array');
});

test('includes timestamp', () => {
  const result = getLogFields();
  const found = result.find(f => f.name === 'timestamp');
  assert.ok(found, 'timestamp should be present');
});

test('includes observedTimeUnixNano', () => {
  const result = getLogFields();
  const found = result.find(f => f.name === 'observedTimeUnixNano');
  assert.ok(found, 'observedTimeUnixNano should be present');
});

test('includes severityNumber', () => {
  const result = getLogFields();
  const found = result.find(f => f.name === 'severityNumber');
  assert.ok(found, 'severityNumber should be present');
});

test('includes severityText', () => {
  const result = getLogFields();
  const found = result.find(f => f.name === 'severityText');
  assert.ok(found, 'severityText should be present');
});

test('includes body', () => {
  const result = getLogFields();
  const found = result.find(f => f.name === 'body');
  assert.ok(found, 'body should be present');
});

test('includes attributes', () => {
  const result = getLogFields();
  const found = result.find(f => f.name === 'attributes');
  assert.ok(found, 'attributes should be present');
});

test('includes traceId', () => {
  const result = getLogFields();
  const found = result.find(f => f.name === 'traceId');
  assert.ok(found, 'traceId should be present');
});

test('includes spanId', () => {
  const result = getLogFields();
  const found = result.find(f => f.name === 'spanId');
  assert.ok(found, 'spanId should be present');
});

test('includes flags', () => {
  const result = getLogFields();
  const found = result.find(f => f.name === 'flags');
  assert.ok(found, 'flags should be present');
});

test('each field has name, type, description, required', () => {
  const result = getLogFields();
  for (const f of result) {
    assert.ok('name' in f, `${JSON.stringify(f)} missing name`);
    assert.ok('type' in f, `${f.name} missing type`);
    assert.ok('description' in f, `${f.name} missing description`);
    assert.ok('required' in f, `${f.name} missing required`);
  }
});

test('returns at least 9 log fields', () => {
  const result = getLogFields();
  assert.ok(result.length >= 9, `expected >= 9 fields, got ${result.length}`);
});

// --- getFieldMetadata (metrics and logs) ---
console.log('getFieldMetadata (metrics/logs):');

test('returns metadata for metrics field', () => {
  const result = getFieldMetadata('metrics', 'attributes');
  assert.ok(result, 'should return a result for metrics.attributes');
  assert.strictEqual(result.name, 'attributes');
});

test('returns null for unknown metrics field', () => {
  const result = getFieldMetadata('metrics', 'nonexistent');
  assert.strictEqual(result, null, 'should return null for unknown metrics field');
});

test('returns metadata for logs field traceId', () => {
  const result = getFieldMetadata('logs', 'traceId');
  assert.ok(result, 'should return a result for logs.traceId');
  assert.strictEqual(result.name, 'traceId');
  assert.ok('type' in result, 'should have type');
  assert.ok('description' in result, 'should have description');
});

test('returns metadata for logs field severityNumber', () => {
  const result = getFieldMetadata('logs', 'severityNumber');
  assert.ok(result, 'should return a result for logs.severityNumber');
  assert.strictEqual(result.name, 'severityNumber');
});

test('returns null for unknown logs field', () => {
  const result = getFieldMetadata('logs', 'nonexistent');
  assert.strictEqual(result, null, 'should return null for unknown logs field');
});

test('still returns metadata for traces.traceId (unchanged)', () => {
  const result = getFieldMetadata('traces', 'traceId');
  assert.ok(result, 'should return a result for traces.traceId');
  assert.strictEqual(result.name, 'traceId');
});

// --- Summary ---
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) {
  process.exit(1);
}