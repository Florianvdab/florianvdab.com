import { describe, expect, it } from 'vitest';
import { currentYearMonth, formatDuration, formatYearMonth, monthIndex } from './duration';

describe('formatDuration', () => {
  it('counts a single month as "1 mo"', () => {
    expect(formatDuration('2023-09', '2023-09')).toBe('1 mo');
  });

  it('counts both start and end month', () => {
    // Bel&Bo: Feb–May 2021
    expect(formatDuration('2021-02', '2021-05')).toBe('4 mos');
  });

  it('formats exact years without months', () => {
    expect(formatDuration('2022-01', '2022-12')).toBe('1 yr');
    expect(formatDuration('2020-01', '2021-12')).toBe('2 yrs');
  });

  it('formats years and months', () => {
    // CCV Lab: Sep 2023 – May 2025
    expect(formatDuration('2023-09', '2025-05')).toBe('1 yr 9 mos');
    // Robaws: Aug 2021 – Aug 2023
    expect(formatDuration('2021-08', '2023-08')).toBe('2 yrs 1 mo');
  });

  it('runs an open-ended role until now', () => {
    const now = new Date(Date.UTC(2026, 8, 29)); // 29 Sep 2026
    expect(formatDuration('2025-06', null, now)).toBe('1 yr 4 mos');
  });

  it('rejects an end before the start', () => {
    expect(() => formatDuration('2024-05', '2024-04')).toThrow(/before start/);
  });

  it('rejects malformed dates', () => {
    expect(() => formatDuration('2024-13', null)).toThrow(/YYYY-MM/);
    expect(() => formatDuration('2024-1', null)).toThrow(/YYYY-MM/);
  });
});

describe('helpers', () => {
  it('orders months correctly across years', () => {
    expect(monthIndex('2025-01') - monthIndex('2024-12')).toBe(1);
  });

  it('formats the current month in UTC', () => {
    expect(currentYearMonth(new Date(Date.UTC(2026, 0, 31, 23, 30)))).toBe('2026-01');
  });

  it('formats a month for display', () => {
    expect(formatYearMonth('2025-06')).toBe('Jun 2025');
    expect(formatYearMonth('2021-12')).toBe('Dec 2021');
  });

  it('formats Dutch months', () => {
    expect(formatYearMonth('2025-03', 'nl')).toBe('mrt 2025');
    expect(formatYearMonth('2025-05', 'nl')).toBe('mei 2025');
  });
});

describe('formatDuration in Dutch', () => {
  it('uses Dutch units with correct plurals', () => {
    expect(formatDuration('2023-09', '2023-09', undefined, 'nl')).toBe('1 maand');
    expect(formatDuration('2021-02', '2021-05', undefined, 'nl')).toBe('4 maanden');
    expect(formatDuration('2021-08', '2023-08', undefined, 'nl')).toBe('2 jaar 1 maand');
    expect(formatDuration('2022-01', '2022-12', undefined, 'nl')).toBe('1 jaar');
  });
});
