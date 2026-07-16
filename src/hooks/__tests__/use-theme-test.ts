import { renderHook } from '@testing-library/react-native';

import { useTheme } from '../use-theme';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Mock useColorScheme hook
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(),
}));

describe('useTheme hook', () => {
  it('returns light theme colors by default when color scheme is unspecified', async () => {
    (useColorScheme as jest.Mock).mockReturnValue('unspecified');
    const { result } = await renderHook(() => useTheme());
    expect(result.current).toEqual(Colors.light);
  });

  it('returns light theme colors when color scheme is light', async () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    const { result } = await renderHook(() => useTheme());
    expect(result.current).toEqual(Colors.light);
  });

  it('returns dark theme colors when color scheme is dark', async () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    const { result } = await renderHook(() => useTheme());
    expect(result.current).toEqual(Colors.dark);
  });
});
