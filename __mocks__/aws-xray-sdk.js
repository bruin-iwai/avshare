const mockCaptureAWS = (x) => x;
const mockCaptureHTTPsGlobal = (x) => x;
const mockExpress = {
  openSegment: () => (req, res, next) => next(),
  closeSegment: () => (req, res, next) => next(),
};

module.exports = {
  captureAWS: mockCaptureAWS,
  captureHTTPsGlobal: mockCaptureHTTPsGlobal,
  express: mockExpress,
};
