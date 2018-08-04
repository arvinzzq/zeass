import koaBody from 'koa-body';

function bodyMiddleware(options) {
  return koaBody({
    formidable: { uploadDir: '/tmp' },
    multipart: true,
    jsonLimit: '3mb',
    formLimit: '10mb',
    textLimit: '3mb',
    ...options
  });
}

export default bodyMiddleware;
