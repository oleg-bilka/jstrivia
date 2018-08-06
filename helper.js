exports.streamPromise = (stream) => {
  return new Promise((resolve, reject) => {
    stream.on('end', () => {
      resolve('end');
    });
    stream.on('finish', () => {
      resolve('finish');
    });
    stream.on('error', (error) => {
      reject(error);
    });
  });
}