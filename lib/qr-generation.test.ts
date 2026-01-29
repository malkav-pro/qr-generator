import { describe, it, expect, vi } from 'vitest'
import type { QRConfig } from '@/lib/types/qr-config'

// Track options passed to QRCodeStyling
let capturedOptions: any = null

vi.mock('@liquid-js/qr-code-styling', () => {
  class MockQRCodeStyling {
    _options: any

    constructor(options: any) {
      this._options = options
      capturedOptions = options
    }

    append = vi.fn().mockResolvedValue(undefined)
    serialize = vi.fn().mockResolvedValue('<svg></svg>')
  }

  return {
    QRCodeStyling: MockQRCodeStyling,
    browserUtils: {
      drawToCanvas: (qr: any) => ({
        canvas: {
          width: qr._options.width,
          height: qr._options.height,
          toDataURL: () => 'data:image/png;base64,mock-data',
        },
        canvasDrawingPromise: Promise.resolve(),
      }),
    },
  }
})

const { createQRCode, createQRCodeWithSize, generateQRCode, generateQRDataURL } =
  await import('./qr-generation')

const baseConfig: QRConfig = {
  data: 'https://example.com',
  foreground: '#000000',
  background: '#FFFFFF',
  scale: 10,
}

describe('createQRCode', () => {
  it('creates QR with solid foreground color', () => {
    const qr = createQRCode(baseConfig)
    expect(qr).toBeDefined()
    expect(qr._options.data).toBe('https://example.com')
    expect(qr._options.dotsOptions.color).toBe('#000000')
  })

  it('creates QR with gradient foreground', () => {
    const config: QRConfig = {
      ...baseConfig,
      foregroundGradient: {
        type: 'linear',
        rotation: Math.PI / 2,
        colorStops: [
          { offset: 0, color: '#FF0000FF' },
          { offset: 1, color: '#0000FFFF' },
        ],
      },
    }
    const qr = createQRCode(config)
    expect(qr._options.dotsOptions.gradient).toBeDefined()
    expect(qr._options.dotsOptions.color).toBeUndefined()
  })

  it('applies dot style options', () => {
    const qr = createQRCode({ ...baseConfig, dotsStyle: 'rounded' })
    expect(qr._options.dotsOptions.type).toBe('rounded')
  })

  it('applies corner square and dot styles', () => {
    const qr = createQRCode({
      ...baseConfig,
      cornersSquareStyle: 'extra-rounded',
      cornersSquareColor: '#FF0000',
      cornersDotStyle: 'dot',
      cornersDotColor: '#0000FF',
    })
    expect(qr._options.cornersSquareOptions.type).toBe('extra-rounded')
    expect(qr._options.cornersSquareOptions.color).toBe('#FF0000')
    expect(qr._options.cornersDotOptions.type).toBe('dot')
    expect(qr._options.cornersDotOptions.color).toBe('#0000FF')
  })

  it('includes logo with hideBackgroundDots', () => {
    const qr = createQRCode({
      ...baseConfig,
      logo: {
        image: 'data:image/png;base64,mock',
        size: 0.3,
        margin: 10,
        hideBackgroundDots: true,
      },
    })
    expect(qr._options.image).toBe('data:image/png;base64,mock')
    expect(qr._options.imageOptions).toBeDefined()
    expect(qr._options.imageOptions.hideBackgroundDots).toBe(true)
    expect(qr._options.imageOptions.imageSize).toBe(0.3)
  })

  it('uses error correction level H', () => {
    const qr = createQRCode(baseConfig)
    expect(qr._options.qrOptions.errorCorrectionLevel).toBe('H')
  })

  it('applies 4-module quiet zone margin', () => {
    const qr = createQRCode(baseConfig)
    expect(qr._options.backgroundOptions.margin).toBe(4)
  })

  it('handles transparent background', () => {
    const qr = createQRCode({ ...baseConfig, background: 'transparent' })
    expect(qr._options.backgroundOptions.color).toBe('transparent')
  })

  it('applies shape option', () => {
    const qr = createQRCode({ ...baseConfig, shape: 'circle' })
    expect(qr._options.shape).toBe('circle')
  })

  it('defaults shape to square', () => {
    const qr = createQRCode(baseConfig)
    expect(qr._options.shape).toBe('square')
  })
})

describe('createQRCodeWithSize', () => {
  it('creates QR with explicit pixel size', () => {
    const qr = createQRCodeWithSize(baseConfig, 512)
    expect(qr._options.width).toBe(512)
    expect(qr._options.height).toBe(512)
  })

  it('applies 4-module quiet zone margin', () => {
    const qr = createQRCodeWithSize(baseConfig, 500)
    expect(qr._options.backgroundOptions.margin).toBe(4)
  })
})

describe('generateQRCode', () => {
  it('appends QR to container element', async () => {
    const container = document.createElement('div')
    await generateQRCode(container, baseConfig)
    // append() was called (mock resolves)
    expect(capturedOptions.data).toBe('https://example.com')
  })

  it('clears container when data is empty', async () => {
    const container = document.createElement('div')
    container.appendChild(document.createElement('canvas'))
    await generateQRCode(container, { ...baseConfig, data: '' })
    expect(container.children.length).toBe(0)
  })

  it('clears container when data is only whitespace', async () => {
    const container = document.createElement('div')
    container.appendChild(document.createElement('canvas'))
    await generateQRCode(container, { ...baseConfig, data: '   ' })
    expect(container.children.length).toBe(0)
  })
})

describe('generateQRDataURL', () => {
  it('generates base64 PNG data URL', async () => {
    const dataURL = await generateQRDataURL(baseConfig)
    expect(dataURL).toBe('data:image/png;base64,mock-data')
  })

  it('throws error when data is empty', async () => {
    await expect(
      generateQRDataURL({ ...baseConfig, data: '' })
    ).rejects.toThrow('data is empty')
  })

  it('accepts optional width parameter', async () => {
    const dataURL = await generateQRDataURL(baseConfig, 1024)
    expect(dataURL).toBe('data:image/png;base64,mock-data')
  })
})
