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

// Export for Node.js (test.js), expose globally for browser (<script>)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getResourceAttributes, getSignalTypes };
}
if (typeof window !== 'undefined') {
  window.getResourceAttributes = getResourceAttributes;
  window.getSignalTypes = getSignalTypes;
}