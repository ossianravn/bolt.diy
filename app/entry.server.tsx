import type { AppLoadContext, EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import { renderHeadToString } from 'remix-island';
import { Head } from './root';
import { themeStore } from '~/lib/stores/theme';
import { initializeModelList } from '~/utils/constants';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  await initializeModelList({});
  
  const head = renderHeadToString({ request, remixContext, Head });
  const doctype = '<!DOCTYPE html>';
  const html = `<html lang="en" data-theme="${themeStore.value}">`;
  
  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
  responseHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady() {
          const response = new Response(
            new ReadableStream({
              start(controller) {
                controller.enqueue(new TextEncoder().encode(doctype + html + '<head>' + head + '</head><body><div id="root" class="w-full h-full">'));
                
                pipe(new WritableStream({
                  write(chunk) {
                    controller.enqueue(chunk);
                  },
                  close() {
                    controller.enqueue(new TextEncoder().encode('</div></body></html>'));
                    controller.close();
                  },
                }));
              },
            }),
            {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }
          );

          resolve(response);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          didError = true;
          console.error(error);
        },
      }
    );

    setTimeout(abort, 5000);
  });
}
