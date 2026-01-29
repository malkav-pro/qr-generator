import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { QRConfig } from '@/lib/types/qr-config'

vi.mock('@liquid-js/qr-code-styling', () => {
  class MockQRCodeStyling {
    _options: any

    constructor(options: any) {
      this._options = options
    }

    serialize() {
      return Promise.resolve('<svg>mock-svg-content</svg>')
    }
  }

  return {
    QRCodeStyling: MockQRCodeStyling,
  }
})

const { getQRCodeSVGBlob, getQRCodeSVGDataURL, exportQRCodeSVG } =
  await import('./svg-export')

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

const baseConfig: QRConfig = {
  data: 'https://example.com',
  foreground: '#000000',
  background: '#FFFFFF',
  scale: 10,
}

describe('getQRCodeSVGBlob', () => {
  it('generates SVG blob from config', async () => {
    const blob = await getQRCodeSVGBlob(baseConfig)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('image/svg+xml')
  })

  it('throws error when data is empty', async () => {
    await expect(
      getQRCodeSVGBlob({ ...baseConfig, data: '' })
    ).rejects.toThrow('data is empty')
  })

  it('applies all styling options (gradient, styles, logo)', async () => {
    const config: QRConfig = {
      ...baseConfig,
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
    const blob = await getQRCodeSVGBlob({ ...baseConfig, background: 'transparent' })
    expect(blob).toBeInstanceOf(Blob)
  })
})

describe('getQRCodeSVGDataURL', () => {
  it('generates base64 SVG data URL', async () => {
    const dataURL = await getQRCodeSVGDataURL(baseConfig)
    expect(dataURL).toBe('data:image/svg+xml;base64,mock-svg-data')
  })

  it('throws error when data is empty', async () => {
    await expect(
      getQRCodeSVGDataURL({ ...baseConfig, data: '' })
    ).rejects.toThrow('data is empty')
  })
})

describe('exportQRCodeSVG', () => {
  let mockLink: HTMLAnchorElement
  let appendChildSpy: ReturnType<typeof vi.spyOn>
  let removeChildSpy: ReturnType<typeof vi.spyOn>

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
    await expect(
      exportQRCodeSVG({ ...baseConfig, data: '' })
    ).rejects.toThrow('data is empty')
  })

  it('sets correct href from blob URL', async () => {
    await exportQRCodeSVG(baseConfig)
    expect(mockLink.href).toBe('blob:mock-svg-url')
  })
})
