import jsQR from 'jsqr'
import { LABEL_PREFIX } from './store'

async function toCanvas(file: File, maxSide: number): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * scale)
    canvas.height = Math.round(img.naturalHeight * scale)
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Shrinks a phone photo so it is small enough to keep on the device. */
export async function shrink(file: File): Promise<string> {
  return (await toCanvas(file, 1400)).toDataURL('image/jpeg', 0.8)
}

/** Looks for a shelf label in a photo and returns the shelf id, or null if none is readable. */
export async function readLabel(file: File): Promise<string | null> {
  // A label can be small in a large photo, so try more than one size.
  for (const side of [1000, 1800]) {
    const canvas = await toCanvas(file, side)
    const data = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height)
    const found = jsQR(data.data, data.width, data.height)
    if (found?.data.startsWith(LABEL_PREFIX)) return found.data.slice(LABEL_PREFIX.length)
  }
  return null
}
