import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getQRCodeSVGBlob, getQRCodeSVGDataURL, exportQRCodeSVG } from './svg-export'
import type { QRConfig } from '@/lib/types/qr-config'

// Mock qr-code-styling
vi.mock('qr-code-styling', () => {
  class MockQRCodeStyling {
    _options: any

    constructor(options: any) {
      this._options = options
    }

    getRawData(type: string) {
      if (type === 'svg') {
        return Promise.resolve(new Blob(['<svg>mock-svg-content</svg>'], { type: 'image/svg+xml' }))
      }
      return Promise.resolve(new Blob(['mock-data'], { type: 'image/png' }))
    }
  }

  return {
    default: MockQRCodeStyling,
  }
})

// Mock browser APIs
global.FileReader = class MockFileReader {
  onloadend: (() => void) | null = null
  onerror: (() => void) | null = null
  result: string | null = null

  readAsDataURL() {
    this.result = 'data:image/svg+xml;base64,mock-svg-data'
    setTimeout(() => {
      if (this.onloadend) this.onloadend()
    }, 0)
  }
} as any

global.URL.createObjectURL = vi.fn(() => 'blob:mock-svg-url')
global.URL.revokeObjectURL = vi.fn()

describe('getQRCodeSVGBlob', () => {
  const baseConfig: QRConfig = {
    data: 'https://example.com',
    foreground: '#000000',
    background: '#FFFFFF',
    scale: 10,
  }

  it('generates SVG blob from config', async () => {
    const blob = await getQRCodeSVGBlob(baseConfig)

    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('image/svg+xml')
  })

  it('throws error when data is empty', async () => {
    const config: QRConfig = {
      data: '',
      foreground: '#000000',
      background: '#FFFFFF',
      scale: 10,
    }

    await expect(getQRCodeSVGBlob(config)).rejects.toThrow('data is empty')
  })

  it('applies all styling options (gradient, styles, logo)', async () => {
    const config: QRConfig = {
      data: 'https://example.com',
      foreground: '#000000',
      background: '#FFFFFF',
      scale: 10,
      foregroundGradient: {
        type: 'linear',
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: '#FF0000FF' },
          { offset: 1, color: '#0000FFFF' },
        ],
      },
      dotsStyle: 'rounded',
      cornersSquareStyle: 'extra-rounded',
      cornersDotStyle: 'dot',
      logo: {
        image: 'data:image/png;base64,logo',
        size: 0.25,
        margin: 5,
        hideBackgroundDots: true,
      },
    }

    const blob = await getQRCodeSVGBlob(config)

    expect(blob).toBeInstanceOf(Blob)
  })

  it('handles transparent background', async () => {
    const config: QRConfig = {
      ...baseConfig,
      background: 'transparent',
    }

    const blob = await getQRCodeSVGBlob(config)

    expect(blob).toBeInstanceOf(Blob)
  })
})

describe('getQRCodeSVGDataURL', () => {
  const baseConfig: QRConfig = {
    data: 'https://example.com',
    foreground: '#000000',
    background: '#FFFFFF',
    scale: 10,
  }

  it('generates base64 SVG data URL', async () => {
    const dataURL = await getQRCodeSVGDataURL(baseConfig)

    expect(dataURL).toBe('data:image/svg+xml;base64,mock-svg-data')
    expect(dataURL).toContain('data:image/svg+xml')
  })

  it('throws error when data is empty', async () => {
    const config: QRConfig = {
      data: '',
      foreground: '#000000',
      background: '#FFFFFF',
      scale: 10,
    }

    await expect(getQRCodeSVGDataURL(config)).rejects.toThrow('data is empty')
  })

  it('uses getQRCodeSVGBlob internally', async () => {
    const dataURL = await getQRCodeSVGDataURL(baseConfig)

    // Verify that it returns a data URL (the mock FileReader provides this)
    expect(dataURL).toMatch(/^data:image\/svg\+xml/)
  })
})

describe('exportQRCodeSVG', () => {
  let mockLink: HTMLAnchorElement
  let appendChildSpy: any
  let removeChildSpy: any

  beforeEach(() => {
    mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    } as any

    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink)
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink)
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink)
  })

  const baseConfig: QRConfig = {
    data: 'https://example.com',
    foreground: '#000000',
    background: '#FFFFFF',
    scale: 10,
  }

  it('creates download link and triggers download', async () => {
    await exportQRCodeSVG(baseConfig)

    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockLink.click).toHaveBeenCalled()
    expect(appendChildSpy).toHaveBeenCalledWith(mockLink)
    expect(removeChildSpy).toHaveBeenCalledWith(mockLink)
  })

  it('uses provided filename', async () => {
    await exportQRCodeSVG(baseConfig, 'my-qr-code.svg')

    expect(mockLink.download).toBe('my-qr-code.svg')
  })

  it('uses default filename when not provided', async () => {
    await exportQRCodeSVG(baseConfig)

    expect(mockLink.download).toBe('qrcode.svg')
  })

  it('cleans up object URL after download', async () => {
    await exportQRCodeSVG(baseConfig)

    expect(global.URL.createObjectURL).toHaveBeenCalled()
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-svg-url')
  })

  it('throws error when data is empty', async () => {
    const config: QRConfig = {
      data: '',
      foreground: '#000000',
      background: '#FFFFFF',
      scale: 10,
    }

    await expect(exportQRCodeSVG(config)).rejects.toThrow('data is empty')
  })

  it('sets correct href from blob URL', async () => {
    await exportQRCodeSVG(baseConfig)

    expect(mockLink.href).toBe('blob:mock-svg-url')
  })
})
