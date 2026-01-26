import { describe, it, expect } from 'vitest'
import {
  validateLogoFile,
  calculateLogoPercentage,
  getRecommendedLogoSize,
} from './logo-validation'

describe('validateLogoFile', () => {
  it('accepts PNG files under 5MB', () => {
    const file = new File(['test'], 'logo.png', { type: 'image/png' })
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

    const result = validateLogoFile(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('accepts JPEG files under 5MB', () => {
    const file = new File(['test'], 'logo.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file, 'size', { value: 1024 * 1024 })

    const result = validateLogoFile(file)
    expect(result.valid).toBe(true)
  })

  it('accepts JPG mime type', () => {
    const file = new File(['test'], 'logo.jpg', { type: 'image/jpg' })
    Object.defineProperty(file, 'size', { value: 1024 * 1024 })

    const result = validateLogoFile(file)
    expect(result.valid).toBe(true)
  })

  it('rejects files over 5MB', () => {
    const file = new File(['test'], 'logo.png', { type: 'image/png' })
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }) // 6MB

    const result = validateLogoFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('File size must be less than 5MB')
  })

  it('rejects files exactly at 5MB limit', () => {
    const file = new File(['test'], 'logo.png', { type: 'image/png' })
    Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 + 1 }) // Just over 5MB

    const result = validateLogoFile(file)
    expect(result.valid).toBe(false)
  })

  it('accepts files exactly under 5MB limit', () => {
    const file = new File(['test'], 'logo.png', { type: 'image/png' })
    Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 }) // Exactly 5MB

    const result = validateLogoFile(file)
    expect(result.valid).toBe(true)
  })

  it('rejects non-image file types', () => {
    const file = new File(['test'], 'document.pdf', { type: 'application/pdf' })
    Object.defineProperty(file, 'size', { value: 1024 })

    const result = validateLogoFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Only PNG and JPG images are supported')
  })

  it('rejects unsupported image types (GIF)', () => {
    const file = new File(['test'], 'logo.gif', { type: 'image/gif' })
    Object.defineProperty(file, 'size', { value: 1024 })

    const result = validateLogoFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Only PNG and JPG images are supported')
  })

  it('rejects unsupported image types (WebP)', () => {
    const file = new File(['test'], 'logo.webp', { type: 'image/webp' })
    Object.defineProperty(file, 'size', { value: 1024 })

    const result = validateLogoFile(file)
    expect(result.valid).toBe(false)
  })
})

describe('calculateLogoPercentage', () => {
  it('calculates correct percentage for logo area', () => {
    // 100x100 logo on 500x500 QR = 10000/250000 = 4%
    const result = calculateLogoPercentage(100, 100, 500)
    expect(result.percentage).toBe(4)
  })

  it('returns "safe" level for ≤20% coverage', () => {
    // 100x100 logo on 224x224 QR = 10000/50176 ≈ 19.93%
    const result = calculateLogoPercentage(100, 100, 224)
    expect(result.level).toBe('safe')
    expect(result.percentage).toBeLessThanOrEqual(20)
  })

  it('returns "safe" level for exactly 20% coverage', () => {
    // Calculate logo size for exactly 20%: sqrt(500*500*0.20) ≈ 223.6
    const logoSize = Math.floor(Math.sqrt(500 * 500 * 0.20))
    const result = calculateLogoPercentage(logoSize, logoSize, 500)
    expect(result.level).toBe('safe')
  })

  it('returns "warning" level for 20-25% coverage', () => {
    // 120x120 logo on 250x250 QR = 14400/62500 = 23.04%
    const result = calculateLogoPercentage(120, 120, 250)
    expect(result.level).toBe('warning')
    expect(result.percentage).toBeGreaterThan(20)
    expect(result.percentage).toBeLessThanOrEqual(25)
  })

  it('returns "danger" level for >25% coverage', () => {
    // 150x150 logo on 250x250 QR = 22500/62500 = 36%
    const result = calculateLogoPercentage(150, 150, 250)
    expect(result.level).toBe('danger')
    expect(result.percentage).toBeGreaterThan(25)
  })

  it('handles non-square logos', () => {
    // 200x100 logo on 500x500 QR = 20000/250000 = 8%
    const result = calculateLogoPercentage(200, 100, 500)
    expect(result.percentage).toBe(8)
    expect(result.level).toBe('safe')
  })

  it('calculates 100% coverage for logo same size as QR', () => {
    const result = calculateLogoPercentage(500, 500, 500)
    expect(result.percentage).toBe(100)
    expect(result.level).toBe('danger')
  })

  it('calculates small logo percentage', () => {
    // 10x10 logo on 500x500 QR = 100/250000 = 0.04%
    const result = calculateLogoPercentage(10, 10, 500)
    expect(result.percentage).toBeCloseTo(0.04, 2)
    expect(result.level).toBe('safe')
  })
})

describe('getRecommendedLogoSize', () => {
  it('calculates square dimensions for 20% coverage', () => {
    const recommended = getRecommendedLogoSize(500)

    // For 20% coverage: side = 500 * sqrt(0.20) ≈ 223.6, floor to 223
    expect(recommended.width).toBe(223)
    expect(recommended.height).toBe(223)

    // Verify it's actually ≤20%
    const check = calculateLogoPercentage(recommended.width, recommended.height, 500)
    expect(check.percentage).toBeLessThanOrEqual(20)
  })

  it('returns integer pixel values', () => {
    const recommended = getRecommendedLogoSize(333)
    expect(Number.isInteger(recommended.width)).toBe(true)
    expect(Number.isInteger(recommended.height)).toBe(true)
  })

  it('returns same width and height (square)', () => {
    const recommended = getRecommendedLogoSize(400)
    expect(recommended.width).toBe(recommended.height)
  })

  it('scales proportionally for different QR sizes', () => {
    const small = getRecommendedLogoSize(250)
    const large = getRecommendedLogoSize(500)

    // Large QR should have roughly 2x the recommended logo size (within 1px due to floor)
    expect(large.width).toBeGreaterThanOrEqual(small.width * 2 - 1)
    expect(large.width).toBeLessThanOrEqual(small.width * 2 + 1)
  })

  it('calculates recommended size for typical QR code size (512px)', () => {
    const recommended = getRecommendedLogoSize(512)

    // Should be floor(512 * sqrt(0.20)) = floor(228.96) = 228
    expect(recommended.width).toBe(228)

    // Verify it stays under 20%
    const check = calculateLogoPercentage(recommended.width, recommended.height, 512)
    expect(check.level).toBe('safe')
  })

  it('handles small QR codes', () => {
    const recommended = getRecommendedLogoSize(100)
    expect(recommended.width).toBeGreaterThan(0)

    const check = calculateLogoPercentage(recommended.width, recommended.height, 100)
    expect(check.percentage).toBeLessThanOrEqual(20)
  })
})
