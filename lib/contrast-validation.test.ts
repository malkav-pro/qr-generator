import { describe, it, expect } from 'vitest'
import { getRelativeLuminance, calculateContrastRatio, validateContrast, validateGradientContrast } from './contrast-validation'
import { Gradient } from './types/gradient'

describe('getRelativeLuminance', () => {
  it('calculates correct luminance for white (#FFFFFF)', () => {
    const luminance = getRelativeLuminance('#FFFFFF')
    expect(luminance).toBeCloseTo(1.0, 2)
  })

  it('calculates correct luminance for black (#000000)', () => {
    const luminance = getRelativeLuminance('#000000')
    expect(luminance).toBeCloseTo(0.0, 2)
  })

  it('calculates correct luminance for gray colors', () => {
    // Mid gray (#808080) should have luminance around 0.22
    const luminance = getRelativeLuminance('#808080')
    expect(luminance).toBeGreaterThan(0.2)
    expect(luminance).toBeLessThan(0.3)
  })

  it('handles 3-char hex format (#FFF)', () => {
    const luminance3 = getRelativeLuminance('#FFF')
    const luminance6 = getRelativeLuminance('#FFFFFF')
    expect(luminance3).toBeCloseTo(luminance6, 5)
  })

  it('handles 6-char hex format (#FFFFFF)', () => {
    const luminance = getRelativeLuminance('#FFFFFF')
    expect(luminance).toBeCloseTo(1.0, 2)
  })

  it('handles hex without # prefix', () => {
    const luminanceWith = getRelativeLuminance('#FFFFFF')
    const luminanceWithout = getRelativeLuminance('FFFFFF')
    expect(luminanceWith).toBeCloseTo(luminanceWithout, 5)
  })

  it('applies gamma correction correctly', () => {
    // Test that different colors produce different luminance values
    const red = getRelativeLuminance('#FF0000')
    const green = getRelativeLuminance('#00FF00')
    const blue = getRelativeLuminance('#0000FF')

    // Green should have highest luminance (0.7152 weight in formula)
    expect(green).toBeGreaterThan(red)
    expect(green).toBeGreaterThan(blue)
    // Red should be greater than blue (0.2126 vs 0.0722)
    expect(red).toBeGreaterThan(blue)
  })
})

describe('calculateContrastRatio', () => {
  it('calculates 21:1 ratio for black and white', () => {
    const ratio = calculateContrastRatio('#000000', '#FFFFFF')
    expect(ratio).toBeCloseTo(21, 0)
  })

  it('calculates correct ratio for gray colors', () => {
    const ratio = calculateContrastRatio('#FFFFFF', '#808080')
    // Should be around 3.9:1 for white vs mid gray
    expect(ratio).toBeGreaterThan(3.5)
    expect(ratio).toBeLessThan(4.5)
  })

  it('returns same ratio regardless of color order', () => {
    const ratio1 = calculateContrastRatio('#000000', '#FFFFFF')
    const ratio2 = calculateContrastRatio('#FFFFFF', '#000000')
    expect(ratio1).toBeCloseTo(ratio2, 5)
  })

  it('handles identical colors (ratio = 1:1)', () => {
    const ratio = calculateContrastRatio('#FF0000', '#FF0000')
    expect(ratio).toBeCloseTo(1.0, 2)
  })

  it('calculates correct ratio for blue and yellow', () => {
    const ratio = calculateContrastRatio('#0000FF', '#FFFF00')
    // Should be high contrast (around 8:1)
    expect(ratio).toBeGreaterThan(7)
  })
})

describe('validateContrast', () => {
  it('passes for 12:1 contrast (default minimum)', () => {
    // Black on white is 21:1, should pass
    const isValid = validateContrast('#000000', '#FFFFFF')
    expect(isValid).toBe(true)
  })

  it('passes for high contrast colors', () => {
    // Test with colors that exceed 12:1 contrast
    // Black (#000000) on very light gray (#DEDEDE) gives approximately 15:1
    const isValid = validateContrast('#000000', '#DEDEDE')
    expect(isValid).toBe(true)
  })

  it('fails for low contrast colors', () => {
    // White on light gray should fail 12:1 requirement
    const isValid = validateContrast('#FFFFFF', '#CCCCCC')
    expect(isValid).toBe(false)
  })

  it('allows transparent backgrounds', () => {
    // Transparent backgrounds should always pass (can't validate)
    const isValid = validateContrast('#000000', 'transparent')
    expect(isValid).toBe(true)
  })

  it('respects custom minimum ratio', () => {
    // Test with 4.5:1 minimum (WCAG AA standard)
    const isValid = validateContrast('#FFFFFF', '#808080', 4.5)
    expect(isValid).toBe(false)

    // Should pass with lower minimum
    const isValidLower = validateContrast('#FFFFFF', '#808080', 3)
    expect(isValidLower).toBe(true)
  })

  it('handles 3-char hex codes', () => {
    const isValid = validateContrast('#000', '#FFF')
    expect(isValid).toBe(true)
  })
})

describe('validateGradientContrast', () => {
  it('passes when all stops have sufficient contrast', () => {
    // Black and dark gray stops against white background
    const gradient: Gradient = {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#000000FF' },
        { offset: 1, color: '#333333FF' }
      ]
    };
    const result = validateGradientContrast(gradient, '#FFFFFF', 4.5);
    expect(result.valid).toBe(true);
    expect(result.worstRatio).toBeGreaterThan(4.5);
  })

  it('fails when one stop has insufficient contrast', () => {
    // Black and light gray stops against white background
    const gradient: Gradient = {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#000000' },
        { offset: 1, color: '#CCCCCC' }  // Light gray fails against white
      ]
    };
    const result = validateGradientContrast(gradient, '#FFFFFF', 4.5);
    expect(result.valid).toBe(false);
    expect(result.worstRatio).toBeLessThan(4.5);
    expect(result.worstStop).toBeDefined();
    expect(result.worstStop?.color).toBe('#CCCCCC');
  })

  it('strips alpha channel from hex8 colors for luminance calculation', () => {
    // Red at 50% opacity - luminance should use only RGB part
    const gradient: Gradient = {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#FF000080' },  // Red with 50% alpha
        { offset: 1, color: '#FF0000FF' }   // Red with 100% alpha
      ]
    };
    const result = validateGradientContrast(gradient, '#FFFFFF', 4.5);

    // Both stops should have same contrast ratio (alpha is ignored)
    // Red (#FF0000) vs white should be around 4:1
    expect(result.worstRatio).toBeGreaterThan(3.5);
    expect(result.worstRatio).toBeLessThan(4.5);
  })

  it('returns valid for empty gradient', () => {
    const gradient: Gradient = {
      type: 'linear',
      colorStops: []
    };
    const result = validateGradientContrast(gradient, '#FFFFFF', 4.5);
    expect(result.valid).toBe(true);
    expect(result.worstRatio).toBe(Infinity);
    expect(result.worstStop).toBeNull();
  })

  it('works correctly with single color stop', () => {
    const gradient: Gradient = {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#000000' }
      ]
    };
    const result = validateGradientContrast(gradient, '#FFFFFF', 4.5);
    expect(result.valid).toBe(true);
    expect(result.worstRatio).toBeCloseTo(21, 0);  // Black on white is 21:1
    expect(result.worstStop?.color).toBe('#000000');
  })

  it('returns valid for transparent background', () => {
    const gradient: Gradient = {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#000000' },
        { offset: 1, color: '#CCCCCC' }
      ]
    };
    const result = validateGradientContrast(gradient, 'transparent', 4.5);
    expect(result.valid).toBe(true);
    expect(result.worstRatio).toBe(Infinity);
    expect(result.worstStop).toBeNull();
  })
})

describe('validateContrast - regression test', () => {
  it('existing solid color validation still works', () => {
    // Ensure validateContrast function unchanged
    expect(validateContrast('#000000', '#FFFFFF', 12)).toBe(true);
    expect(validateContrast('#CCCCCC', '#FFFFFF', 12)).toBe(false);
    expect(validateContrast('#000000', 'transparent', 12)).toBe(true);
  })
})
