import { describe, expect, it } from 'vitest'
import { csvCell } from './csv'

describe('csvCell', () => {
  it('quotes values, escapes embedded quotes and removes line breaks', () => {
    expect(csvCell('Pack "A"\n48 V')).toBe('"Pack ""A"" 48 V"')
  })

  it('serializes empty values safely', () => {
    expect(csvCell(undefined)).toBe('""')
  })

  it('neutralizes spreadsheet formula prefixes', () => {
    expect(csvCell('=HYPERLINK("https://example.com")')).toBe('"\'=HYPERLINK(""https://example.com"")"')
  })
})
