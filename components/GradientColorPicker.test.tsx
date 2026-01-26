import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GradientColorPicker } from './GradientColorPicker'

// Mock react-colorful
vi.mock('react-colorful', () => ({
  HexColorPicker: ({ color, onChange }: { color: string; onChange: (color: string) => void }) => (
    <div data-testid="hex-color-picker">
      <input
        data-testid="color-picker-input"
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}))

describe('GradientColorPicker', () => {
  const defaultProps = {
    label: 'Foreground',
    solidColor: '#000000',
    gradientStart: '#FF0000',
    gradientEnd: '#0000FF',
    gradientType: 'horizontal' as const,
    mode: 'solid' as const,
    onSolidChange: vi.fn(),
    onGradientStartChange: vi.fn(),
    onGradientEndChange: vi.fn(),
    onGradientTypeChange: vi.fn(),
    onModeChange: vi.fn(),
  }

  it('renders solid/gradient mode toggle', () => {
    render(<GradientColorPicker {...defaultProps} />)

    expect(screen.getByText('Solid')).toBeInTheDocument()
    expect(screen.getByText('Gradient')).toBeInTheDocument()
  })

  it('shows color picker in solid mode', () => {
    render(<GradientColorPicker {...defaultProps} mode="solid" />)

    // Should show hex input for solid color
    const input = screen.getByDisplayValue('#000000')
    expect(input).toBeInTheDocument()
  })

  it('shows 2 color inputs in gradient mode', () => {
    render(<GradientColorPicker {...defaultProps} mode="gradient" />)

    expect(screen.getByText('Start color')).toBeInTheDocument()
    expect(screen.getByText('End color')).toBeInTheDocument()
    expect(screen.getByDisplayValue('#FF0000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('#0000FF')).toBeInTheDocument()
  })

  it('shows direction selector in gradient mode', () => {
    render(<GradientColorPicker {...defaultProps} mode="gradient" />)

    expect(screen.getByText('Gradient direction')).toBeInTheDocument()
    expect(screen.getByText('Horizontal')).toBeInTheDocument()
    expect(screen.getByText('Vertical')).toBeInTheDocument()
    expect(screen.getByText('Diagonal')).toBeInTheDocument()
    expect(screen.getByText('Radial')).toBeInTheDocument()
  })

  it('calls onSolidChange when solid color changes', async () => {
    const user = userEvent.setup()
    const onSolidChange = vi.fn()

    render(
      <GradientColorPicker
        {...defaultProps}
        mode="solid"
        onSolidChange={onSolidChange}
      />
    )

    const input = screen.getByDisplayValue('#000000')
    await user.clear(input)
    await user.type(input, '#FF0000')

    expect(onSolidChange).toHaveBeenCalled()
  })

  it('calls onGradientStartChange when gradient start changes', async () => {
    const user = userEvent.setup()
    const onGradientStartChange = vi.fn()

    render(
      <GradientColorPicker
        {...defaultProps}
        mode="gradient"
        onGradientStartChange={onGradientStartChange}
      />
    )

    const input = screen.getByDisplayValue('#FF0000')
    await user.clear(input)
    await user.type(input, '#00FF00')

    expect(onGradientStartChange).toHaveBeenCalled()
  })

  it('calls onGradientEndChange when gradient end changes', async () => {
    const user = userEvent.setup()
    const onGradientEndChange = vi.fn()

    render(
      <GradientColorPicker
        {...defaultProps}
        mode="gradient"
        onGradientEndChange={onGradientEndChange}
      />
    )

    const input = screen.getByDisplayValue('#0000FF')
    await user.clear(input)
    await user.type(input, '#00FF00')

    expect(onGradientEndChange).toHaveBeenCalled()
  })

  it('calls onGradientTypeChange when direction changes', async () => {
    const user = userEvent.setup()
    const onGradientTypeChange = vi.fn()

    render(
      <GradientColorPicker
        {...defaultProps}
        mode="gradient"
        gradientType="horizontal"
        onGradientTypeChange={onGradientTypeChange}
      />
    )

    const verticalButton = screen.getByText('Vertical')
    await user.click(verticalButton)

    expect(onGradientTypeChange).toHaveBeenCalledWith('vertical')
  })

  it('switches between modes', async () => {
    const user = userEvent.setup()
    const onModeChange = vi.fn()

    render(
      <GradientColorPicker
        {...defaultProps}
        mode="solid"
        onModeChange={onModeChange}
      />
    )

    const gradientButton = screen.getByText('Gradient')
    await user.click(gradientButton)

    expect(onModeChange).toHaveBeenCalledWith('gradient')
  })

  it('highlights active mode button', () => {
    render(<GradientColorPicker {...defaultProps} mode="gradient" />)

    const gradientButton = screen.getByText('Gradient')
    const solidButton = screen.getByText('Solid')

    expect(gradientButton).toHaveClass('bg-white', 'shadow-sm')
    expect(solidButton).not.toHaveClass('bg-white', 'shadow-sm')
  })

  it('shows color swatch in solid mode', () => {
    render(<GradientColorPicker {...defaultProps} mode="solid" solidColor="#FF0000" />)

    const swatch = screen.getByLabelText(/color swatch/)
    expect(swatch).toHaveStyle({ backgroundColor: '#FF0000' })
  })

  it('shows gradient preview in gradient mode', () => {
    render(
      <GradientColorPicker
        {...defaultProps}
        mode="gradient"
        gradientType="horizontal"
      />
    )

    const preview = screen.getByLabelText(/gradient preview/)
    expect(preview).toBeInTheDocument()
  })

  it('auto-prepends # to hex input', async () => {
    const user = userEvent.setup()
    const onSolidChange = vi.fn()

    render(
      <GradientColorPicker
        {...defaultProps}
        mode="solid"
        solidColor=""
        onSolidChange={onSolidChange}
      />
    )

    const input = screen.getByPlaceholderText('#000000')
    await user.type(input, 'FF0000')

    // Should have called with # prepended
    expect(onSolidChange).toHaveBeenCalledWith(expect.stringContaining('#'))
  })

  it('shows validation error for invalid hex', () => {
    render(
      <GradientColorPicker
        {...defaultProps}
        mode="solid"
        solidColor="invalid"
      />
    )

    expect(screen.getByText(/Enter a valid hex color/)).toBeInTheDocument()
  })

  it('toggles color picker on swatch click', async () => {
    const user = userEvent.setup()

    render(<GradientColorPicker {...defaultProps} mode="solid" />)

    // Color picker should not be visible initially
    expect(screen.queryByTestId('hex-color-picker')).not.toBeInTheDocument()

    // Click swatch
    const swatch = screen.getByLabelText(/color swatch/)
    await user.click(swatch)

    // Color picker should now be visible
    expect(screen.getByTestId('hex-color-picker')).toBeInTheDocument()
  })

  it('highlights selected gradient direction', () => {
    render(
      <GradientColorPicker
        {...defaultProps}
        mode="gradient"
        gradientType="vertical"
      />
    )

    const verticalButton = screen.getByText('Vertical')
    const horizontalButton = screen.getByText('Horizontal')

    expect(verticalButton).toHaveClass('bg-blue-600', 'text-white')
    expect(horizontalButton).not.toHaveClass('bg-blue-600', 'text-white')
  })
})
