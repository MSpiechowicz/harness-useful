// SVG to PNG with resvg-wasm. The wasm module is initialised once per process.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { initWasm, Resvg } from '@resvg/resvg-wasm';

let wasmReady: Promise<void> | undefined;

function ensureWasm(): Promise<void> {
  if (!wasmReady) {
    const wasmPath = fileURLToPath(import.meta.resolve('@resvg/resvg-wasm/index_bg.wasm'));

    wasmReady = readFile(wasmPath).then((bytes) => initWasm(bytes));
  }

  return wasmReady;
}

/** Renders an SVG string to a PNG that is `width` pixels wide. */
export async function svgToPng(svg: string, width: number): Promise<Buffer> {
  await ensureWasm();

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } });
  const png = resvg.render().asPng();

  return Buffer.from(png);
}
