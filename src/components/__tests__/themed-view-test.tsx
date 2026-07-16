import { render } from '@testing-library/react-native';
import React from 'react';

import { ThemedView } from '../themed-view';

// Mock useTheme hook to return consistent colors for testing styles
jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  }),
}));

describe('ThemedView', () => {
  it('renders correctly with default background color', async () => {
    const { getByTestId } = await render(<ThemedView testID="themed-view" />);
    const viewElement = getByTestId('themed-view');
    expect(viewElement.props.style).toContainEqual({ backgroundColor: '#ffffff' });
  });

  it('renders correctly with backgroundElement type', async () => {
    const { getByTestId } = await render(<ThemedView testID="themed-view" type="backgroundElement" />);
    const viewElement = getByTestId('themed-view');
    expect(viewElement.props.style).toContainEqual({ backgroundColor: '#F0F0F3' });
  });

  it('applies custom styling props', async () => {
    const { getByTestId } = await render(<ThemedView testID="themed-view" style={{ flex: 1 }} />);
    const viewElement = getByTestId('themed-view');
    expect(viewElement.props.style).toContainEqual({ flex: 1 });
  });
});
