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

// Export for Node.js (test.js), expose globally for browser (<script>)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getResourceAttributes, getSignalTypes, getTraceSchema, getSpanFields };
}
if (typeof window !== 'undefined') {
  window.getResourceAttributes = getResourceAttributes;
  window.getSignalTypes = getSignalTypes;
  window.getTraceSchema = getTraceSchema;
  window.getSpanFields = getSpanFields;
}