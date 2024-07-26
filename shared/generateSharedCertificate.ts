import selfsigned from 'selfsigned';

export function generateSharedCertificate() {
  const attrs = [{ name: 'commonName', value: '*' }];
  const pems = selfsigned.generate(attrs, {
    keySize: 2048,
    days: 365,
    algorithm: 'sha256',
    extensions: [{
      name: 'subjectAltName',
      altNames: [
        { type: 2, value: 'localhost' },
        { type: 2, value: '*' }
      ]
    }]
  });
  return { key: pems.private, cert: pems.cert };
}