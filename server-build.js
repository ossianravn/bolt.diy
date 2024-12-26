import serverPkg from 'react-dom/server';
const { renderToReadableStream } = serverPkg;
import * as serverBuild from './build/server/index.js';

export default {
  ...serverBuild,
  default: {
    ...serverBuild.default,
    renderToReadableStream
  }
}; 