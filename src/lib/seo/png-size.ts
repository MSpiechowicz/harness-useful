// Reads the pixel size from the IHDR chunk of a PNG (bytes 16-23). Used by tests and the build audit.

const PNG_SIGNATURE = '89504e470d0a1a0a';

export function pngSize(png: Uint8Array): { width: number; height: number } {
  const buffer = Buffer.from(png.buffer, png.byteOffset, png.byteLength);

  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== PNG_SIGNATURE) {
    throw new Error('Not a PNG file');
  }

  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}
