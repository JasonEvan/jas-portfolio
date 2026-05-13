// composables/useImageBase64.ts
import imageCompression from 'browser-image-compression'

export interface ImageOptions {
  maxSizeMB?: number          // default: 0.55
  maxWidthOrHeight?: number   // default: 1280
  quality?: number            // default: 0.8 (dipakai via options)
}

export const useImageBase64 = () => {

  /**
   * Kompres file gambar lalu encode ke base64.
   * Output siap disimpan ke Firestore.
   */
  const fileToBase64 = async (file: File, options: ImageOptions = {}): Promise<string> => {
    const compressed = await imageCompression(file, {
      maxSizeMB:        options.maxSizeMB ?? 0.55,
      maxWidthOrHeight: options.maxWidthOrHeight ?? 1280,
      useWebWorker:     true,
      fileType:         'image/webp',
    })

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload  = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(compressed)
    })
  }

  /**
   * Buat thumbnail kecil untuk list view (max 200px, < 20 KB)
   */
  const fileToThumb = async (file: File): Promise<string> => {
    return fileToBase64(file, { maxSizeMB: 0.018, maxWidthOrHeight: 200 })
  }

  /**
   * Estimasi ukuran base64 dalam bytes
   */
  const estimateBase64Size = (base64: string): number => {
    const data = base64.split(',')[1] || base64
    return Math.ceil(data.length * 0.75)
  }

  /**
   * Apakah aman disimpan dalam dokumen yang sama? (< 700 KB)
   */
  const isSafeForSameDoc = (base64: string): boolean => {
    return estimateBase64Size(base64) < 700_000
  }

  return { fileToBase64, fileToThumb, estimateBase64Size, isSafeForSameDoc }
}
