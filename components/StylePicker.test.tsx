import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DotStylePicker, CornerSquareStylePicker, CornerDotStylePicker, ShapePicker } from './StylePicker'
import { DOT_STYLES, CORNER_SQUARE_STYLES, CORNER_DOT_STYLES } from '@/lib/constants/qr-styles'

// Mock the style-previews module since we're testing the picker logic, not the previews
vi.mock('./style-previews', () => ({
  DotStylePreview: ({ style }: { style: string }) => <div data-testid={`dot-preview-${style}`}>{style}</div>,
  CornerSquarePreview: ({ style }: { style: string }) => <div data-testid={`corner-square-preview-${style}`}>{style}</div>,
  CornerDotPreview: ({ style }: { style: string }) => <div data-testid={`corner-dot-preview-${style}`}>{style}</div>,
}))

describe('DotStylePicker', () => {
  it('renders all dot styles', () => {
    const onChange = vi.fn()
    render(<DotStylePicker value="square" onChange={onChange} />)

    for (const style of DOT_STYLES) {
      expect(screen.getByText(style.label)).toBeInTheDocument()
    }
  })

  it('shows selected state for current value', () => {
    const onChange = vi.fn()
    render(<DotStylePicker value="rounded" onChange={onChange} />)

    const roundedButton = screen.getByText('Rounded').closest('button')
    expect(roundedButton?.className).toContain('border-[var(--accent-start)]')
  })

  it('calls onChange when style is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DotStylePicker value="square" onChange={onChange} />)

    const dotButton = screen.getByText('Dot').closest('button')
    await user.click(dotButton!)

    expect(onChange).toHaveBeenCalledWith('dot')
  })

  it('renders preview component for each option', () => {
    const onChange = vi.fn()
    render(<DotStylePicker value="square" onChange={onChange} />)

    expect(screen.getByTestId('dot-preview-square')).toBeInTheDocument()
    expect(screen.getByTestId('dot-preview-dot')).toBeInTheDocument()
    expect(screen.getByTestId('dot-preview-rounded')).toBeInTheDocument()
  })

  it('shows label text', () => {
    const onChange = vi.fn()
    render(<DotStylePicker value="square" onChange={onChange} />)
    expect(screen.getByText('Dot Style')).toBeInTheDocument()
  })

  it('highlights only the selected style', () => {
    const onChange = vi.fn()
    render(<DotStylePicker value="classy" onChange={onChange} />)

    const classyButton = screen.getByText('Classy').closest('button')
    const squareButton = screen.getByText('Square').closest('button')

    expect(classyButton?.className).toContain('border-[var(--accent-start)]')
    expect(squareButton?.className).not.toContain('border-[var(--accent-start)]')
  })
})

describe('CornerSquareStylePicker', () => {
  it('renders all corner square styles', () => {
    const onChange = vi.fn()
    render(<CornerSquareStylePicker value="square" onChange={onChange} />)

    for (const style of CORNER_SQUARE_STYLES) {
      expect(screen.getByText(style.label)).toBeInTheDocument()
    }
  })

  it('shows selected state for current value', () => {
    const onChange = vi.fn()
    render(<CornerSquareStylePicker value="dot" onChange={onChange} />)

    const dotButton = screen.getByText('Dot').closest('button')
    expect(dotButton?.className).toContain('border-[var(--accent-start)]')
  })

  it('calls onChange when style is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CornerSquareStylePicker value="square" onChange={onChange} />)

    const extraRoundedButton = screen.getByText('Extra Rounded').closest('button')
    await user.click(extraRoundedButton!)

    expect(onChange).toHaveBeenCalledWith('extra-rounded')
  })

  it('shows label text', () => {
    const onChange = vi.fn()
    render(<CornerSquareStylePicker value="square" onChange={onChange} />)
    expect(screen.getByText('Corner Square Style')).toBeInTheDocument()
  })
})

describe('CornerDotStylePicker', () => {
  it('renders all corner dot styles', () => {
    const onChange = vi.fn()
    render(<CornerDotStylePicker value="square" onChange={onChange} />)

    for (const style of CORNER_DOT_STYLES) {
      expect(screen.getByText(style.label)).toBeInTheDocument()
    }
  })

  it('shows selected state for current value', () => {
    const onChange = vi.fn()
    render(<CornerDotStylePicker value="square" onChange={onChange} />)

    const squareButton = screen.getByText('Square').closest('button')
    expect(squareButton?.className).toContain('border-[var(--accent-start)]')
  })

  it('calls onChange when style is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CornerDotStylePicker value="square" onChange={onChange} />)

    const dotButton = screen.getByText('Dot').closest('button')
    await user.click(dotButton!)

    expect(onChange).toHaveBeenCalledWith('dot')
  })

  it('shows label text', () => {
    const onChange = vi.fn()
    render(<CornerDotStylePicker value="square" onChange={onChange} />)
    expect(screen.getByText('Corner Dot Style')).toBeInTheDocument()
  })
})

describe('ShapePicker', () => {
  it('renders square and circle options', () => {
    const onChange = vi.fn()
    render(<ShapePicker value="square" onChange={onChange} />)

    expect(screen.getByText('Square')).toBeInTheDocument()
    expect(screen.getByText('Circle')).toBeInTheDocument()
  })

  it('shows selected state for current value', () => {
    const onChange = vi.fn()
    render(<ShapePicker value="circle" onChange={onChange} />)

    const circleButton = screen.getByText('Circle').closest('button')
    expect(circleButton?.className).toContain('border-[var(--accent-start)]')
  })

  it('calls onChange when shape is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ShapePicker value="square" onChange={onChange} />)

    const circleButton = screen.getByText('Circle').closest('button')
    await user.click(circleButton!)

    expect(onChange).toHaveBeenCalledWith('circle')
  })

  it('shows label text', () => {
    const onChange = vi.fn()
    render(<ShapePicker value="square" onChange={onChange} />)
    expect(screen.getByText('Shape')).toBeInTheDocument()
  })
})
