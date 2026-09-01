// otel-logic.js — Pure functions for the OTel Visual Explainer
// This module is imported by both index.html (via <script>) and test.js (via require)

const resourceAttributes = [
  {
    name: 'service.name',
    type: 'string',
    description: 'The name of the service being instrumented. This is the primary identifier for a service in telemetry data.',
    required: true,
    example: 'checkout-service'
  },
  {
    name: 'service.instance.id',
    type: 'string',
    description: 'A unique identifier for this instance of the service. Distinguishes between multiple replicas of the same service.',
    required: false,
    example: 'abc123-def456'
  },
  {
    name: 'service.namespace',
    type: 'string',
    description: 'A group or category name for the service. Useful for organizing services into logical groups.',
    required: false,
    example: 'checkout'
  },
  {
    name: 'service.version',
    type: 'string',
    description: 'The version of the service. Useful for correlating issues with specific deployments.',
    required: false,
    example: '2.4.1'
  },
  {
    name: 'host.name',
    type: 'string',
    description: 'The hostname of the machine running the service.',
    required: false,
    example: 'prod-node-04'
  },
  {
    name: 'host.id',
    type: 'string',
    description: 'A unique host identifier. Useful for cloud instances where hostname may change.',
    required: false,
    example: 'i-0a1b2c3d4e5f6g7'
  },
  {
    name: 'host.arch',
    type: 'string',
    description: 'The CPU architecture of the host.',
    required: false,
    example: 'arm64'
  },
  {
    name: 'host.type',
    type: 'string',
    description: 'The type of host (e.g., cloud provider instance type).',
    required: false,
    example: 'm5.large'
  }
];

const signalTypes = [
  {
    id: 'traces',
    name: 'Traces',
    description: 'Distributed traces track request flow across service boundaries. A trace is a tree of spans, each representing a unit of work.'
  },
  {
    id: 'metrics',
    name: 'Metrics',
    description: 'Metrics capture measurements at a point in time or over an interval. Aggregated, numeric data: counters, gauges, histograms.'
  },
  {
    id: 'logs',
    name: 'Logs',
    description: 'Log records capture discrete events with timestamps. Logs can correlate to traces via trace ID and span ID.'
  }
];

function getResourceAttributes() {
  return resourceAttributes;
}

function getSignalTypes() {
  return signalTypes;
}

const traceSchema = {
  resource: {
    description: 'Describes the entity producing telemetry (service, host, container). Shared across all signals.',
    attributes: 'see Resource Model table above'
  },
  instrumentationScope: {
    name: 'InstrumentationScope',
    version: '1.0.0',
    description: 'Identifies the instrumentation library that produced the span. Distinguishes application-level from library-level telemetry.'
  },
  span: {
    description: 'A unit of work in a distributed trace. Spans form a tree via parent-child relationships.'
  }
};

const spanFields = [
  {
    name: 'traceId',
    type: 'bytes (16)',
    description: 'Unique identifier for the entire trace. All spans in a trace share this ID.',
    required: true,
    example: '0af7651916cd43dd8448eb211c80319c'
  },
  {
    name: 'spanId',
    type: 'bytes (8)',
    description: 'Unique identifier for this span within the trace.',
    required: true,
    example: 'b7ad6b7169203331'
  },
  {
    name: 'parentSpanId',
    type: 'bytes (8)',
    description: 'Span ID of the parent span. Null for root spans. This field creates the trace tree structure.',
    required: false,
    example: '77e1a0d6e1c4a2b3'
  },
  {
    name: 'kind',
    type: 'enum',
    description: 'The span kind indicates the relationship between spans. INTERNAL = within a service, SERVER = server-side of a remote call, CLIENT = client-side of a remote call, PRODUCER = sends to async destination, CONSUMER = receives from async destination.',
    required: true,
    enumValues: ['INTERNAL', 'SERVER', 'CLIENT', 'PRODUCER', 'CONSUMER'],
    example: 'SERVER'
  },
  {
    name: 'name',
    type: 'string',
    description: 'A human-readable name for the span. Typically the operation or method name.',
    required: true,
    example: 'GET /api/checkout'
  },
  {
    name: 'startTimeUnixNano',
    type: 'uint64',
    description: 'Start timestamp of the span in Unix nanoseconds.',
    required: true,
    example: '1700000000000000000'
  },
  {
    name: 'endTimeUnixNano',
    type: 'uint64',
    description: 'End timestamp of the span in Unix nanoseconds.',
    required: true,
    example: '1700000000500000000'
  },
  {
    name: 'attributes',
    type: 'KeyValue[]',
    description: 'Key-value pairs attached to the span. Used for contextual metadata (e.g., http.method, db.statement).',
    required: false,
    example: 'http.method=GET, http.status_code=200'
  },
  {
    name: 'events',
    type: 'Event[]',
    description: 'Time-stamped events recorded during the span. Each event has a name, timestamp, and optional attributes.',
    required: false,
    example: 'name=exception, timestamp=..., attributes={exception.message=...}'
  },
  {
    name: 'links',
    type: 'Link[]',
    description: 'Links to other spans, used when a span is related to spans outside its parent-child tree (e.g., fan-out or batch processing).',
    required: false,
    example: 'traceId=..., spanId=...'
  },
  {
    name: 'status',
    type: 'Status',
    description: 'The status of the span execution. Can be UNSET, OK, or ERROR with an optional message.',
    required: true,
    enumValues: ['UNSET', 'OK', 'ERROR'],
    example: 'code=OK'
  },
  {
    name: 'flags',
    type: 'uint32',
    description: 'Trace flags. Bit 1 indicates whether the trace should be sampled (1) or not (0).',
    required: true,
    example: '1'
  }
];

function getTraceSchema() {
  return traceSchema;
}

function getSpanFields() {
  return spanFields;
}

// Sample trace tree for relationship highlighting
// span-a (root) → span-b, span-c (children of a) → span-d (child of b)
const spanTree = {
  'span-a': { parent: null, children: ['span-b', 'span-c'], name: 'GET /api/checkout', kind: 'SERVER' },
  'span-b': { parent: 'span-a', children: ['span-d'], name: 'process_payment', kind: 'INTERNAL' },
  'span-c': { parent: 'span-a', children: [], name: 'DB query: user lookup', kind: 'CLIENT' },
  'span-d': { parent: 'span-b', children: [], name: 'charge_card', kind: 'CLIENT' }
};

// Metric instrument types with their data point fields
const metricTypes = [
  {
    name: 'Counter',
    type: 'Counter',
    description: 'A monotonically increasing counter for cumulative values (e.g., total requests served). Never decreases.',
    required: true,
    fields: [
      { name: 'startTimeUnixNano', type: 'uint64', description: 'Start of the aggregation period in Unix nanoseconds.', required: true },
      { name: 'timeUnixNano', type: 'uint64', description: 'Timestamp of the data point in Unix nanoseconds.', required: true },
      { name: 'value', type: 'double', description: 'The current cumulative counter value.', required: true },
      { name: 'attributes', type: 'KeyValue[]', description: 'Key-value pairs describing the dimensions of this data point.', required: false }
    ]
  },
  {
    name: 'Gauge',
    type: 'Gauge',
    description: 'An instantaneous measurement that can increase or decrease (e.g., current memory usage, queue depth).',
    required: true,
    fields: [
      { name: 'timeUnixNano', type: 'uint64', description: 'Timestamp of the measurement in Unix nanoseconds.', required: true },
      { name: 'value', type: 'double', description: 'The current gauge value at this point in time.', required: true },
      { name: 'startTimeUnixNano', type: 'uint64', description: 'Optional start time for the gauge reading.', required: false },
      { name: 'attributes', type: 'KeyValue[]', description: 'Key-value pairs describing the dimensions of this data point.', required: false }
    ]
  },
  {
    name: 'Histogram',
    type: 'Histogram',
    description: 'A distribution of values in explicit buckets (e.g., request latency distribution). Includes count, sum, and bucket boundaries.',
    required: true,
    fields: [
      { name: 'startTimeUnixNano', type: 'uint64', description: 'Start of the aggregation period in Unix nanoseconds.', required: true },
      { name: 'timeUnixNano', type: 'uint64', description: 'Timestamp of the data point in Unix nanoseconds.', required: true },
      { name: 'count', type: 'uint64', description: 'Number of values in the population.', required: true },
      { name: 'sum', type: 'double', description: 'Sum of all values in the population.', required: false },
      { name: 'buckets', type: 'explicitBuckets', description: 'Explicit bucket boundaries and counts. Each bucket is a boundary + cumulative count pair.', required: true },
      { name: 'attributes', type: 'KeyValue[]', description: 'Key-value pairs describing the dimensions of this data point.', required: false }
    ]
  },
  {
    name: 'Exponential Histogram',
    type: 'ExponentialHistogram',
    description: 'A distribution of values in exponential/log-scale buckets (base-2 growth). More compact than explicit buckets for wide-ranging data.',
    required: true,
    fields: [
      { name: 'startTimeUnixNano', type: 'uint64', description: 'Start of the aggregation period in Unix nanoseconds.', required: true },
      { name: 'timeUnixNano', type: 'uint64', description: 'Timestamp of the data point in Unix nanoseconds.', required: true },
      { name: 'count', type: 'uint64', description: 'Number of values in the population.', required: true },
      { name: 'sum', type: 'double', description: 'Sum of all values in the population.', required: false },
      { name: 'scale', type: 'int32', description: 'Scale of the exponential bucket mapping. Higher scale = finer resolution.', required: true },
      { name: 'zeroCount', type: 'uint64', description: 'Number of values exactly equal to zero.', required: false },
      { name: 'positiveBuckets', type: 'Buckets', description: 'Bucket counts for positive values (offset + counts array).', required: true },
      { name: 'negativeBuckets', type: 'Buckets', description: 'Bucket counts for negative values (offset + counts array).', required: false },
      { name: 'attributes', type: 'KeyValue[]', description: 'Key-value pairs describing the dimensions of this data point.', required: false }
    ]
  },
  {
    name: 'Summary',
    type: 'Summary',
    description: 'A pre-computed distribution with quantiles (e.g., p50, p95, p99 latency). The source computes quantiles, not the collector.',
    required: true,
    fields: [
      { name: 'startTimeUnixNano', type: 'uint64', description: 'Start of the aggregation period in Unix nanoseconds.', required: true },
      { name: 'timeUnixNano', type: 'uint64', description: 'Timestamp of the data point in Unix nanoseconds.', required: true },
      { name: 'count', type: 'uint64', description: 'Number of values in the population.', required: true },
      { name: 'sum', type: 'double', description: 'Sum of all values in the population.', required: true },
      { name: 'quantileValues', type: 'QuantileValue[]', description: 'Pre-computed quantile results, each with quantile (0..1), value, and optional flags.', required: true },
      { name: 'attributes', type: 'KeyValue[]', description: 'Key-value pairs describing the dimensions of this data point.', required: false }
    ]
  }
];

function getMetricFields() {
  return metricTypes;
}

// LogRecord fields
const logFields = [
  {
    name: 'timestamp',
    type: 'uint64',
    description: 'The time the event occurred, in Unix nanoseconds. This is the event time, not the collection time.',
    required: false,
    example: '1700000000000000000'
  },
  {
    name: 'observedTimeUnixNano',
    type: 'uint64',
    description: 'The time the log record was observed/collected by the SDK, in Unix nanoseconds. May differ from timestamp if the event was delayed.',
    required: false,
    example: '1700000000100000000'
  },
  {
    name: 'severityNumber',
    type: 'int32',
    description: 'Numeric severity level following the OpenTelemetry severity scale (1=TRACE to 24=FATAL). Enables severity-based filtering and alerting.',
    required: false,
    example: '9'
  },
  {
    name: 'severityText',
    type: 'string',
    description: 'Human-readable severity string (e.g., INFO, WARN, ERROR). Maps to severityNumber but is the original text from the log source.',
    required: false,
    example: 'ERROR'
  },
  {
    name: 'body',
    type: 'AnyValue',
    description: 'The primary log message or payload. Can be a string, number, boolean, or nested structure.',
    required: false,
    example: 'Connection refused to database host db-1.prod'
  },
  {
    name: 'attributes',
    type: 'KeyValue[]',
    description: 'Key-value pairs providing context for the log record (e.g., request.id, user.id, error.code).',
    required: false,
    example: 'error.code=ECONNREFUSED, db.system=postgresql'
  },
  {
    name: 'traceId',
    type: 'bytes (16)',
    description: '🔗 Trace correlation — the trace ID this log belongs to. Lets you jump from a log line to the corresponding trace in the trace viewer.',
    required: false,
    example: '0af7651916cd43dd8448eb211c80319c'
  },
  {
    name: 'spanId',
    type: 'bytes (8)',
    description: '🔗 Trace correlation — the span ID within the trace that produced this log. Pinpoints exactly which span the log came from.',
    required: false,
    example: 'b7ad6b7169203331'
  },
  {
    name: 'flags',
    type: 'uint32',
    description: 'Trace flags. Bit 1 indicates whether the associated trace was sampled. Same field as span flags for cross-signal correlation.',
    required: false,
    example: '1'
  }
];

function getLogFields() {
  return logFields;
}

function getFieldMetadata(signalType, fieldId) {
  if (signalType === 'traces') {
    const field = spanFields.find(f => f.name === fieldId);
    return field || null;
  }
  if (signalType === 'metrics') {
    // Search across all metric instrument types and their sub-fields
    for (const metric of metricTypes) {
      if (metric.name === fieldId || metric.type === fieldId) return metric;
      const field = metric.fields.find(f => f.name === fieldId);
      if (field) return field;
    }
    return null;
  }
  if (signalType === 'logs') {
    const field = logFields.find(f => f.name === fieldId);
    return field || null;
  }
  return null;
}

function getSpanRelationships(spanId) {
  const span = spanTree[spanId];
  if (!span) return null;
  return {
    parent: span.parent,
    children: span.children
  };
}

// Semantic conventions — standard OTel attribute names grouped by category
const semanticConventions = [
  {
    category: 'HTTP',
    attributes: [
      { name: 'http.method', type: 'string', description: 'HTTP request method (e.g., GET, POST, PUT, DELETE).', required: true },
      { name: 'http.status_code', type: 'int', description: 'HTTP response status code (e.g., 200, 404, 500).', required: false },
      { name: 'http.url', type: 'string', description: 'Full HTTP request URL including scheme, host, path, and query string.', required: false },
      { name: 'http.request.body.size', type: 'int', description: 'Size of the HTTP request body in bytes.', required: false },
      { name: 'http.response.body.size', type: 'int', description: 'Size of the HTTP response body in bytes.', required: false },
      { name: 'http.scheme', type: 'string', description: 'The URI scheme (e.g., http, https).', required: false },
      { name: 'http.target', type: 'string', description: 'The full request target as sent in the request line (path and query).', required: false }
    ]
  },
  {
    category: 'Database',
    attributes: [
      { name: 'db.system', type: 'string', description: 'The database management system type (e.g., postgresql, mysql, mongodb).', required: true },
      { name: 'db.statement', type: 'string', description: 'The database statement being executed.', required: false },
      { name: 'db.operation', type: 'string', description: 'The database operation being performed (e.g., insert, select, update).', required: false },
      { name: 'db.connection_string', type: 'string', description: 'The connection string used to connect to the database.', required: false },
      { name: 'db.user', type: 'string', description: 'The database user name used to access the database.', required: false },
      { name: 'db.name', type: 'string', description: 'The database name being accessed.', required: false }
    ]
  },
  {
    category: 'Messaging',
    attributes: [
      { name: 'messaging.system', type: 'string', description: 'The messaging system type (e.g., kafka, rabbitmq, activemq).', required: true },
      { name: 'messaging.destination', type: 'string', description: 'The destination name (e.g., topic or queue name).', required: false },
      { name: 'messaging.operation', type: 'string', description: 'The messaging operation being performed (e.g., publish, receive, process).', required: false },
      { name: 'messaging.message.id', type: 'string', description: 'A unique identifier for the message.', required: false },
      { name: 'messaging.message.body.size', type: 'int', description: 'The size of the message body in bytes.', required: false }
    ]
  },
  {
    category: 'Host',
    attributes: [
      { name: 'host.name', type: 'string', description: 'The hostname of the machine running the service.', required: false },
      { name: 'host.id', type: 'string', description: 'A unique host identifier. Useful for cloud instances where hostname may change.', required: false },
      { name: 'host.arch', type: 'string', description: 'The CPU architecture of the host (e.g., amd64, arm64).', required: false },
      { name: 'host.type', type: 'string', description: 'The type of host (e.g., cloud provider instance type).', required: false }
    ]
  },
  {
    category: 'Service',
    attributes: [
      { name: 'service.name', type: 'string', description: 'The name of the service being instrumented. Primary identifier for a service.', required: true },
      { name: 'service.instance.id', type: 'string', description: 'A unique identifier for this instance of the service.', required: false },
      { name: 'service.version', type: 'string', description: 'The version of the service. Useful for correlating issues with deployments.', required: false },
      { name: 'service.namespace', type: 'string', description: 'A group or category name for the service. Useful for organizing services into logical groups.', required: false }
    ]
  }
];

function getSemanticConventions() {
  return semanticConventions;
}

// Pipeline stage details for the OTLP Pipeline Architecture section
const pipelineStages = {
  instrumentation: {
    name: 'Instrumentation',
    description: 'Auto-instrumentation or manual SDK calls in application code generate telemetry data.',
    keyOperations: ['Create spans', 'Record metrics', 'Emit log records'],
    otlpProtocol: 'In-process SDK calls'
  },
  sdk: {
    name: 'SDK',
    description: 'The OTel SDK configures tracing/metrics/logs, manages sampling, batching, and export.',
    keyOperations: ['Sampling', 'Batching', 'Export configuration'],
    otlpProtocol: 'SDK → Collector via OTLP'
  },
  collector: {
    name: 'Collector',
    description: 'The OTel Collector receives OTLP via gRPC/HTTP, processes data, and exports to backends.',
    keyOperations: ['Receive OTLP', 'Process (filter, enrich, sample)', 'Export to backends'],
    otlpProtocol: 'OTLP/gRPC, OTLP/HTTP'
  },
  backends: {
    name: 'Backends',
    description: 'Backend systems store and visualize telemetry: tracing, metrics, and logging backends.',
    keyOperations: ['Store telemetry', 'Visualize', 'Alert'],
    otlpProtocol: 'Backend-specific protocols'
  }
};

const pipelineStageOrder = ['instrumentation', 'sdk', 'collector', 'backends'];

function getPipelineStageDetails(stageId) {
  const stage = pipelineStages[stageId];
  if (!stage) return null;
  return stage;
}

function getNextPipelineStage(currentStageId) {
  const idx = pipelineStageOrder.indexOf(currentStageId);
  if (idx === -1 || idx >= pipelineStageOrder.length - 1) return null;
  return pipelineStageOrder[idx + 1];
}

// Routing scenarios for the "Where Cribl Fits" section
const routingScenarios = [
  {
    id: 'all-to-one',
    name: 'Route all to one backend',
    description: 'Simple passthrough — all telemetry goes to a single backend.',
    routes: [
      { signal: 'all', destination: 'Single Backend', filter: 'none' }
    ]
  },
  {
    id: 'by-signal-type',
    name: 'Route by signal type',
    description: 'Traces to Jaeger, metrics to Prometheus, logs to Elasticsearch.',
    routes: [
      { signal: 'traces', destination: 'Jaeger', filter: 'signal.type == "traces"' },
      { signal: 'metrics', destination: 'Prometheus', filter: 'signal.type == "metrics"' },
      { signal: 'logs', destination: 'Elasticsearch', filter: 'signal.type == "logs"' }
    ]
  },
  {
    id: 'by-environment',
    name: 'Route by environment',
    description: 'Dev traffic to cheap storage, prod traffic to premium backends.',
    routes: [
      { signal: 'all', destination: 'Cheap S3 Storage', filter: 'deployment.environment == "dev"' },
      { signal: 'all', destination: 'Premium Backends', filter: 'deployment.environment == "prod"' }
    ]
  },
  {
    id: 'by-sampling',
    name: 'Route by sampling',
    description: 'Sample traces at 10%, keep all metrics and logs.',
    routes: [
      { signal: 'traces', destination: 'Jaeger (10% sampled)', filter: 'traces sampled at 10%' },
      { signal: 'metrics', destination: 'Prometheus (full)', filter: 'no sampling' },
      { signal: 'logs', destination: 'Elasticsearch (full)', filter: 'no sampling' }
    ]
  }
];

function getRoutingScenarios() {
  return routingScenarios;
}

function getRoutingScenario(scenarioId) {
  const scenario = routingScenarios.find(s => s.id === scenarioId);
  return scenario || null;
}

// Export for Node.js (test.js), expose globally for browser (<script>)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getResourceAttributes, getSignalTypes, getTraceSchema, getSpanFields, getFieldMetadata, getSpanRelationships, getMetricFields, getLogFields, getSemanticConventions, getPipelineStageDetails, getNextPipelineStage, getRoutingScenarios, getRoutingScenario };
}
if (typeof window !== 'undefined') {
  window.getResourceAttributes = getResourceAttributes;
  window.getSignalTypes = getSignalTypes;
  window.getTraceSchema = getTraceSchema;
  window.getSpanFields = getSpanFields;
  window.getFieldMetadata = getFieldMetadata;
  window.getSpanRelationships = getSpanRelationships;
  window.getMetricFields = getMetricFields;
  window.getLogFields = getLogFields;
  window.getSemanticConventions = getSemanticConventions;
  window.getPipelineStageDetails = getPipelineStageDetails;
  window.getNextPipelineStage = getNextPipelineStage;
  window.getRoutingScenarios = getRoutingScenarios;
  window.getRoutingScenario = getRoutingScenario;
}