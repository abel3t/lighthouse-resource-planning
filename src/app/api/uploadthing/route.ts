import { NextResponse } from 'next/server';
import { createRouteHandler } from 'uploadthing/next';
import { UTApi } from 'uploadthing/server';

import { ourFileRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter

  // Apply an (optional) custom config:
  // config: { ... },
});

export async function DELETE(request: Request) {
  const data = await request.json();
  const newUrl = data.url.substring(data.url.lastIndexOf('/') + 1);
  const utapi = new UTApi();
  await utapi.deleteFiles(newUrl);

  return NextResponse.json({ message: 'ok' });
}
