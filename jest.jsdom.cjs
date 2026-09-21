const { TestEnvironment } = require('jest-environment-jsdom');

/**
 * jest-environment-jsdom 29 uses an older jsdom that does not expose
 * Fetch / encoding APIs. Copy them from Node so MSW 2 can load.
 */
class WatchlogJestEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context);

    this.global.fetch = fetch;
    this.global.Headers = Headers;
    this.global.Request = Request;
    this.global.Response = Response;
    this.global.FormData = FormData;
    this.global.Blob = Blob;
    this.global.File = File;
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoder = TextDecoder;
    this.global.ReadableStream = ReadableStream;
    this.global.TransformStream = TransformStream;
    this.global.BroadcastChannel = BroadcastChannel;
    this.global.structuredClone = structuredClone;
  }
}

module.exports = WatchlogJestEnvironment;
