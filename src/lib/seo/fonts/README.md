# Open Graph card fonts

Static TrueType instances used by `../og.ts` (satori cannot read the woff2 files that
`@fontsource-variable/*` ships).

- `Inter-400.ttf`, `Inter-700.ttf`: instanced from `@fontsource-variable/inter` (latin, weight 400 and 700).
- `JetBrainsMono-500.ttf`: instanced from `@fontsource-variable/jetbrains-mono` (latin, weight 500).

Both families are licensed under the SIL Open Font License 1.1 (see the license files in the source packages).
Regenerate with `woff2_decompress` and fontTools `varLib.instancer` if the families are upgraded.
