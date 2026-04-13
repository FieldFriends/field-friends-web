import { describe, it, expect } from 'vitest';
import { isAcceptingResponses } from '../utils/appStateUtils.js';
import { AppState } from '../schemas/appStateSchema.js';

describe('isAcceptingResponses', () => {
  it('should return true for AppState.Open', () => {
    expect(isAcceptingResponses(AppState.Open)).toBe(true);
  });

  it('should return true for AppState.Scheduled', () => {
    expect(isAcceptingResponses(AppState.Scheduled)).toBe(true);
  });

  it('should return false for AppState.Closed', () => {
    expect(isAcceptingResponses(AppState.Closed)).toBe(false);
  });

  it('should return false for AppState.Paused', () => {
    expect(isAcceptingResponses(AppState.Paused)).toBe(false);
  });
});
