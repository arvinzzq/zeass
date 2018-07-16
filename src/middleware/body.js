import path from 'path';
import koaBody from 'koa-body';

function bodyMiddleware(options) {
  return koaBody({
    formidable: { uploadDir: path.join('/tmp') },
    multipart: true,
    jsonLimit: '3mb',
    formLimit: '10mb',
    textLimit: '3mb',
    ...options
  });
}

export default bodyMiddleware;
