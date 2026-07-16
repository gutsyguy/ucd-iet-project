import { render } from '@testing-library/react-native';
import React from 'react';

import { HintRow } from '../hint-row';

// Mock useTheme hook to return consistent colors for child components
jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  }),
}));

describe('HintRow', () => {
  it('renders default title and hint content', async () => {
    const { getByText } = await render(<HintRow />);
    expect(getByText('Try editing')).toBeTruthy();
    expect(getByText('app/index.tsx')).toBeTruthy();
  });

  it('renders custom title and hint content', async () => {
    const { getByText } = await render(<HintRow title="Run command" hint="npm test" />);
    expect(getByText('Run command')).toBeTruthy();
    expect(getByText('npm test')).toBeTruthy();
  });
});
