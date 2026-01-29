import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { QRConfig } from '@/lib/types/qr-config'

// Track what size gets passed to QRCodeStyling
let capturedOptions: any = null

vi.mock('@liquid-js/qr-code-styling', () => {
  class MockQRCodeStyling {
    _options: any
    constructor(options: any) {
      this._options = options
      capturedOptions = options
    }
  }

  const mockCanvas = {
    width: 0,
    height: 0,
    toBlob: (cb: (blob: Blob | null) => void, type: string) => {
      cb(new Blob(['mock-png'], { type: 'image/png' }))
    },
  }

  return {
    QRCodeStyling: MockQRCodeStyling,
    browserUtils: {
      drawToCanvas: (qr: any) => {
        // Mirror the requested size onto the mock canvas
        mockCanvas.width = qr._options.width
        mockCanvas.height = qr._options.height
        return { canvas: mockCanvas, canvasDrawingPromise: Promise.resolve() }
      },
    },
  }
})

const { exportQRCodePNG } = await import('./png-export')

const baseConfig: QRConfig = {
  data: 'https://example.com',
  foreground: '#000000',
  background: '#FFFFFF',
}

describe('exportQRCodePNG', () => {
  beforeEach(() => {
    capturedOptions = null
  })

  it('renders at 1024px by default', async () => {
    await exportQRCodePNG(baseConfig)
    expect(capturedOptions.width).toBe(1024)
    expect(capturedOptions.height).toBe(1024)
  })

  it('renders at the requested size', async () => {
    await exportQRCodePNG(baseConfig, { sizePx: 2048 })
    expect(capturedOptions.width).toBe(2048)
    expect(capturedOptions.height).toBe(2048)
  })

  it('renders at 4096px for high-res export', async () => {
    await exportQRCodePNG(baseConfig, { sizePx: 4096 })
    expect(capturedOptions.width).toBe(4096)
    expect(capturedOptions.height).toBe(4096)
  })

  it('returns a PNG blob', async () => {
    const blob = await exportQRCodePNG(baseConfig, { sizePx: 2048 })
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('image/png')
  })

  it('throws when data is empty', async () => {
    await expect(
      exportQRCodePNG({ ...baseConfig, data: '' })
    ).rejects.toThrow('data is empty')
  })
})
