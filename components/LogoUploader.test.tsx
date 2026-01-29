import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LogoUploader } from './LogoUploader'

// Mock the validation functions
vi.mock('@/lib/utils/logo-validation', () => ({
  validateLogoFile: vi.fn((file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'File size must be less than 5MB' }
    }
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      return { valid: false, error: 'Only PNG and JPG images are supported' }
    }
    return { valid: true }
  }),
  calculateLogoPercentage: vi.fn((_width: number, _height: number, _qrSize: number) => {
    return { percentage: 10, level: 'safe' }
  }),
  getRecommendedLogoSize: vi.fn((_qrSize: number) => ({
    width: 134,
    height: 134,
  })),
}))

// Mock FileReader and Image
global.FileReader = class MockFileReader {
  onload: ((e: { target: { result: string } }) => void) | null = null
  result: string | null = null

  readAsDataURL(file: File) {
    this.result = `data:image/png;base64,mock-${file.name}`
    setTimeout(() => {
      if (this.onload) {
        this.onload({ target: { result: this.result! } })
      }
    }, 0)
  }
} as any

global.Image = class MockImage {
  onload: (() => void) | null = null
  src = ''
  width = 100
  height = 100

  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload()
    }, 0)
  }
} as any

// Mock alert
global.alert = vi.fn()

describe('LogoUploader', () => {
  const mockOnLogoChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders upload area', () => {
    render(<LogoUploader logo={null} onLogoChange={mockOnLogoChange} />)

    expect(screen.getByText('Logo (Optional)')).toBeInTheDocument()
    expect(screen.getByText(/Click to upload/)).toBeInTheDocument()
    expect(screen.getByText(/or drag and drop/)).toBeInTheDocument()
    expect(screen.getByText('PNG or JPG (max 5MB)')).toBeInTheDocument()
  })

  it('accepts file via click', async () => {
    const user = userEvent.setup()
    render(<LogoUploader logo={null} onLogoChange={mockOnLogoChange} />)

    const file = new File(['logo'], 'logo.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    await waitFor(() => {
      expect(mockOnLogoChange).toHaveBeenCalled()
    })
  })

  it('shows preview when logo uploaded', async () => {
    const logoDataURL = 'data:image/png;base64,mocklogo'
    render(<LogoUploader logo={logoDataURL} onLogoChange={mockOnLogoChange} />)

    const img = screen.getByAltText('Logo preview')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', logoDataURL)
  })

  it('validates file type (PNG/JPG only)', async () => {
    render(<LogoUploader logo={null} onLogoChange={mockOnLogoChange} />)

    const file = new File(['logo'], 'logo.gif', { type: 'image/gif' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    })

    const changeEvent = new Event('change', { bubbles: true })
    input.dispatchEvent(changeEvent)

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Only PNG and JPG images are supported')
    }, { timeout: 500 })
    expect(mockOnLogoChange).not.toHaveBeenCalled()
  })

  it('validates file size (max 5MB)', async () => {
    const user = userEvent.setup()
    render(<LogoUploader logo={null} onLogoChange={mockOnLogoChange} />)

    const file = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', { type: 'image/png' })
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('File size must be less than 5MB')
    })
    expect(mockOnLogoChange).not.toHaveBeenCalled()
  })

  it('removes logo when clear button clicked', async () => {
    const user = userEvent.setup()
    const logoDataURL = 'data:image/png;base64,mocklogo'
    render(<LogoUploader logo={logoDataURL} onLogoChange={mockOnLogoChange} />)

    const removeButton = screen.getByTitle('Remove logo')
    await user.click(removeButton)

    expect(mockOnLogoChange).toHaveBeenCalledWith(null)
  })

  it('accepts file via drag-and-drop', async () => {
    render(<LogoUploader logo={null} onLogoChange={mockOnLogoChange} />)

    const dropZone = screen.getByText(/Click to upload/).closest('div')!
    const file = new File(['logo'], 'logo.png', { type: 'image/png' })

    const dataTransfer = {
      files: [file],
      types: ['Files'],
    }

    const dropEvent = new Event('drop', { bubbles: true })
    Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer })
    Object.assign(dropEvent, {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    })

    dropZone.dispatchEvent(dropEvent)

    await waitFor(() => {
      expect(mockOnLogoChange).toHaveBeenCalled()
    })
  })

  it('has drop zone with dashed border', () => {
    render(<LogoUploader logo={null} onLogoChange={mockOnLogoChange} />)

    const dropZone = document.querySelector('.border-dashed')!
    expect(dropZone).toHaveClass('border-2', 'border-dashed')
  })

  it('calls onLogoChange with data URL', async () => {
    const user = userEvent.setup()
    render(<LogoUploader logo={null} onLogoChange={mockOnLogoChange} />)

    const file = new File(['logo'], 'logo.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(input, file)

    await waitFor(() => {
      expect(mockOnLogoChange).toHaveBeenCalledWith(expect.stringContaining('data:image/png;base64,'))
    })
  })
})
