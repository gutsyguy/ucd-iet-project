import { render } from '@testing-library/react-native';
import React from 'react';

import { ThemedText } from '../themed-text';

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

describe('ThemedText', () => {
  it('renders default text correctly', async () => {
    const { getByText } = await render(<ThemedText>Hello World</ThemedText>);
    const textElement = getByText('Hello World');
    expect(textElement).toBeTruthy();
  });

  it('renders title type text correctly', async () => {
    const { getByText } = await render(<ThemedText type="title">Main Title</ThemedText>);
    const textElement = getByText('Main Title');
    expect(textElement).toBeTruthy();
  });

  it('applies style overrides', async () => {
    const { getByText } = await render(<ThemedText style={{ marginTop: 10 }}>Styled Text</ThemedText>);
    const textElement = getByText('Styled Text');
    expect(textElement.props.style).toContainEqual({ marginTop: 10 });
  });
});
