import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createQRCode, createQRCodeWithSize, generateQRCode, generateQRDataURL } from './qr-generation'
import type { QRConfig } from '@/lib/types/qr-config'

// Mock qr-code-styling
vi.mock('qr-code-styling', () => {
  class MockQRCodeStyling {
    _options: any

    constructor(options: any) {
      this._options = options
    }

    getRawData = vi.fn().mockResolvedValue(new Blob(['mock-qr-data'], { type: 'image/png' }))
  }

  return {
    default: MockQRCodeStyling,
  }
})

// Mock browser APIs
global.Image = class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  src = ''
  width = 250
  height = 250

  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload()
    }, 0)
  }
} as any

global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

global.FileReader = class MockFileReader {
  onloadend: (() => void) | null = null
  onerror: (() => void) | null = null
  result: string | null = null

  readAsDataURL() {
    this.result = 'data:image/png;base64,mock-data'
    setTimeout(() => {
      if (this.onloadend) this.onloadend()
    }, 0)
  }
} as any

describe('createQRCode', () => {
  const baseConfig: QRConfig = {
    data: 'https://example.com',
    foreground: '#000000',
    background: '#FFFFFF',
    scale: 10,
  }

  it('creates QR with solid foreground color', () => {
    const qr = createQRCode(baseConfig)
    expect(qr).toBeDefined()
    expect(qr._options).toBeDefined()
    expect(qr._options.data).toBe('https://example.com')
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
    const config: QRConfig = {
      ...baseConfig,
      dotsStyle: 'rounded',
    }
    const qr = createQRCode(config)
    expect(qr._options.dotsOptions.type).toBe('rounded')
  })

  it('applies corner square and dot styles', () => {
    const config: QRConfig = {
      ...baseConfig,
      cornersSquareStyle: 'extra-rounded',
      cornersSquareColor: '#FF0000',
      cornersDotStyle: 'dot',
      cornersDotColor: '#0000FF',
    }
    const qr = createQRCode(config)
    expect(qr._options.cornersSquareOptions.type).toBe('extra-rounded')
    expect(qr._options.cornersSquareOptions.color).toBe('#FF0000')
    expect(qr._options.cornersDotOptions.type).toBe('dot')
    expect(qr._options.cornersDotOptions.color).toBe('#0000FF')
  })

  it('includes logo with hideBackgroundDots', () => {
    const config: QRConfig = {
      ...baseConfig,
      logo: {
        image: 'data:image/png;base64,mock',
        size: 0.3,
        margin: 10,
        hideBackgroundDots: true,
      },
    }
    const qr = createQRCode(config)
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
    const config: QRConfig = {
      ...baseConfig,
      scale: 10,
    }
    const qr = createQRCode(config)
    // margin = 4 * scale = 4 * 10 = 40
    expect(qr._options.margin).toBe(40)
  })

  it('handles transparent background', () => {
    const config: QRConfig = {
      ...baseConfig,
      background: 'transparent',
    }
    const qr = createQRCode(config)
    expect(qr._options.backgroundOptions.color).toBe('transparent')
  })
})

describe('createQRCodeWithSize', () => {
  const baseConfig: QRConfig = {
    data: 'https://example.com',
    foreground: '#000000',
    background: '#FFFFFF',
  }

  it('creates QR with explicit pixel size', () => {
    const qr = createQRCodeWithSize(baseConfig, 512)
    expect(qr._options.width).toBe(512)
    expect(qr._options.height).toBe(512)
  })

  it('calculates correct margin for given size', () => {
    const qr = createQRCodeWithSize(baseConfig, 500)
    // margin = Math.round((500 * 4) / 25) = Math.round(80) = 80
    expect(qr._options.margin).toBe(80)
  })
})

describe('generateQRCode', () => {
  let mockCanvas: HTMLCanvasElement
  let mockContext: CanvasRenderingContext2D

  beforeEach(() => {
    mockContext = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
    } as any

    mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockContext),
    } as any
  })

  it('renders QR to canvas element', async () => {
    const config: QRConfig = {
      data: 'https://example.com',
      foreground: '#000000',
      background: '#FFFFFF',
      scale: 10,
    }

    await generateQRCode(mockCanvas, config)

    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d')
    expect(mockContext.drawImage).toHaveBeenCalled()
  })

  it('clears canvas when data is empty', async () => {
    const config: QRConfig = {
      data: '',
      foreground: '#000000',
      background: '#FFFFFF',
      scale: 10,
    }

    await generateQRCode(mockCanvas, config)

    expect(mockContext.clearRect).toHaveBeenCalled()
    expect(mockContext.drawImage).not.toHaveBeenCalled()
  })

  it('clears canvas when data is only whitespace', async () => {
    const config: QRConfig = {
      data: '   ',
      foreground: '#000000',
      background: '#FFFFFF',
      scale: 10,
    }

    await generateQRCode(mockCanvas, config)

    expect(mockContext.clearRect).toHaveBeenCalled()
    expect(mockContext.drawImage).not.toHaveBeenCalled()
  })
})

describe('generateQRDataURL', () => {
  it('generates base64 PNG data URL', async () => {
    const config: QRConfig = {
      data: 'https://example.com',
      foreground: '#000000',
      background: '#FFFFFF',
      scale: 10,
    }

    const dataURL = await generateQRDataURL(config)

    expect(dataURL).toBe('data:image/png;base64,mock-data')
  })

  it('throws error when data is empty', async () => {
    const config: QRConfig = {
      data: '',
      foreground: '#000000',
      background: '#FFFFFF',
      scale: 10,
    }

    await expect(generateQRDataURL(config)).rejects.toThrow('data is empty')
  })

  it('uses createQRCode for consistent styling', async () => {
    const config: QRConfig = {
      data: 'https://example.com',
      foreground: '#000000',
      background: '#FFFFFF',
      scale: 10,
      dotsStyle: 'rounded',
    }

    await generateQRDataURL(config)

    // Just verify it doesn't throw - the mock handles the rest
    expect(true).toBe(true)
  })

  it('accepts optional width parameter', async () => {
    const config: QRConfig = {
      data: 'https://example.com',
      foreground: '#000000',
      background: '#FFFFFF',
    }

    const dataURL = await generateQRDataURL(config, 1024)

    expect(dataURL).toBe('data:image/png;base64,mock-data')
  })
})
