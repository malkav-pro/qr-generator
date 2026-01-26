import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DotStylePicker, CornerSquareStylePicker, CornerDotStylePicker } from './StylePicker'

// Mock the style-previews module since we're testing the picker logic, not the previews
vi.mock('./style-previews', () => ({
  DotStylePreview: ({ style }: { style: string }) => <div data-testid={`dot-preview-${style}`}>{style}</div>,
  CornerSquarePreview: ({ style }: { style: string }) => <div data-testid={`corner-square-preview-${style}`}>{style}</div>,
  CornerDotPreview: ({ style }: { style: string }) => <div data-testid={`corner-dot-preview-${style}`}>{style}</div>,
}))

describe('DotStylePicker', () => {
  it('renders all 6 dot styles', () => {
    const onChange = vi.fn()
    render(<DotStylePicker value="square" onChange={onChange} />)

    expect(screen.getByText('Square')).toBeInTheDocument()
    expect(screen.getByText('Dots')).toBeInTheDocument()
    expect(screen.getByText('Rounded')).toBeInTheDocument()
    expect(screen.getByText('Classy')).toBeInTheDocument()
    expect(screen.getByText('Classy Rounded')).toBeInTheDocument()
    expect(screen.getByText('Extra Rounded')).toBeInTheDocument()
  })

  it('shows selected state for current value', () => {
    const onChange = vi.fn()
    render(<DotStylePicker value="rounded" onChange={onChange} />)

    const roundedButton = screen.getByText('Rounded').closest('button')
    expect(roundedButton).toHaveClass('ring-2', 'ring-blue-500')
  })

  it('calls onChange when style is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DotStylePicker value="square" onChange={onChange} />)

    const dotsButton = screen.getByText('Dots').closest('button')
    await user.click(dotsButton!)

    expect(onChange).toHaveBeenCalledWith('dots')
  })

  it('renders preview component for each option', () => {
    const onChange = vi.fn()
    render(<DotStylePicker value="square" onChange={onChange} />)

    expect(screen.getByTestId('dot-preview-square')).toBeInTheDocument()
    expect(screen.getByTestId('dot-preview-dots')).toBeInTheDocument()
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

    expect(classyButton).toHaveClass('ring-2', 'ring-blue-500')
    expect(squareButton).not.toHaveClass('ring-2', 'ring-blue-500')
  })
})

describe('CornerSquareStylePicker', () => {
  it('renders all 3 corner square styles', () => {
    const onChange = vi.fn()
    render(<CornerSquareStylePicker value="square" onChange={onChange} />)

    expect(screen.getByText('Square')).toBeInTheDocument()
    expect(screen.getByText('Dot')).toBeInTheDocument()
    expect(screen.getByText('Extra Rounded')).toBeInTheDocument()
  })

  it('shows selected state for current value', () => {
    const onChange = vi.fn()
    render(<CornerSquareStylePicker value="dot" onChange={onChange} />)

    const dotButton = screen.getByText('Dot').closest('button')
    expect(dotButton).toHaveClass('ring-2', 'ring-blue-500')
  })

  it('calls onChange when style is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CornerSquareStylePicker value="square" onChange={onChange} />)

    const extraRoundedButton = screen.getByText('Extra Rounded').closest('button')
    await user.click(extraRoundedButton!)

    expect(onChange).toHaveBeenCalledWith('extra-rounded')
  })

  it('renders preview component for each option', () => {
    const onChange = vi.fn()
    render(<CornerSquareStylePicker value="square" onChange={onChange} />)

    expect(screen.getByTestId('corner-square-preview-square')).toBeInTheDocument()
    expect(screen.getByTestId('corner-square-preview-dot')).toBeInTheDocument()
    expect(screen.getByTestId('corner-square-preview-extra-rounded')).toBeInTheDocument()
  })

  it('shows label text', () => {
    const onChange = vi.fn()
    render(<CornerSquareStylePicker value="square" onChange={onChange} />)

    expect(screen.getByText('Corner Square Style')).toBeInTheDocument()
  })
})

describe('CornerDotStylePicker', () => {
  it('renders all 2 corner dot styles', () => {
    const onChange = vi.fn()
    render(<CornerDotStylePicker value="square" onChange={onChange} />)

    expect(screen.getByText('Square')).toBeInTheDocument()
    expect(screen.getByText('Dot')).toBeInTheDocument()
  })

  it('shows selected state for current value', () => {
    const onChange = vi.fn()
    render(<CornerDotStylePicker value="square" onChange={onChange} />)

    const squareButton = screen.getByText('Square').closest('button')
    expect(squareButton).toHaveClass('ring-2', 'ring-blue-500')
  })

  it('calls onChange when style is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CornerDotStylePicker value="square" onChange={onChange} />)

    const dotButton = screen.getByText('Dot').closest('button')
    await user.click(dotButton!)

    expect(onChange).toHaveBeenCalledWith('dot')
  })

  it('renders preview component for each option', () => {
    const onChange = vi.fn()
    render(<CornerDotStylePicker value="square" onChange={onChange} />)

    expect(screen.getByTestId('corner-dot-preview-square')).toBeInTheDocument()
    expect(screen.getByTestId('corner-dot-preview-dot')).toBeInTheDocument()
  })

  it('shows label text', () => {
    const onChange = vi.fn()
    render(<CornerDotStylePicker value="square" onChange={onChange} />)

    expect(screen.getByText('Corner Dot Style')).toBeInTheDocument()
  })
})
