import pkg from 'react-dom/server';
const { renderToReadableStream } = pkg;
import * as serverBuild from './build/server/index.js';

export default {
  ...serverBuild,
  default: {
    ...serverBuild.default,
    renderToReadableStream
  }
}; 