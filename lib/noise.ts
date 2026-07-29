/**
 * Improved Perlin noise, three dimensions, returning roughly -1 to 1.
 *
 * The permutation table is fixed rather than seeded, so the hero renders
 * identically on every machine and every build. That matters because the
 * static frame drawn under prefers-reduced-motion should not be a lottery.
 */

const PERM_SOURCE = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142,
  8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203,
  117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
  71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92,
  41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208,
  89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
  226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58,
  17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155,
  167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
  246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249,
  14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4,
  150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156,
  180,
]

// Doubled so the lookups below never need a modulo.
const PERM = new Uint8Array(512)
for (let i = 0; i < 512; i++) PERM[i] = PERM_SOURCE[i & 255]

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a)
}

function grad(hash: number, x: number, y: number, z: number): number {
  const h = hash & 15
  const u = h < 8 ? x : y
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z
  return (h & 1 ? -u : u) + (h & 2 ? -v : v)
}

export function noise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x) & 255
  const yi = Math.floor(y) & 255
  const zi = Math.floor(z) & 255

  const xf = x - Math.floor(x)
  const yf = y - Math.floor(y)
  const zf = z - Math.floor(z)

  const u = fade(xf)
  const v = fade(yf)
  const w = fade(zf)

  const a = PERM[xi] + yi
  const aa = PERM[a] + zi
  const ab = PERM[a + 1] + zi
  const b = PERM[xi + 1] + yi
  const ba = PERM[b] + zi
  const bb = PERM[b + 1] + zi

  return lerp(
    lerp(
      lerp(grad(PERM[aa], xf, yf, zf), grad(PERM[ba], xf - 1, yf, zf), u),
      lerp(grad(PERM[ab], xf, yf - 1, zf), grad(PERM[bb], xf - 1, yf - 1, zf), u),
      v,
    ),
    lerp(
      lerp(grad(PERM[aa + 1], xf, yf, zf - 1), grad(PERM[ba + 1], xf - 1, yf, zf - 1), u),
      lerp(
        grad(PERM[ab + 1], xf, yf - 1, zf - 1),
        grad(PERM[bb + 1], xf - 1, yf - 1, zf - 1),
        u,
      ),
      v,
    ),
    w,
  )
}
