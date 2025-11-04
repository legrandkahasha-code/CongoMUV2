import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Example Component', () => {
  it('should render the example component', () => {
    render(
      <div>
        <h1>Bienvenue sur CongoMuv</h1>
        <p>Votre solution de transport au Congo</p>
      </div>
    );

    expect(screen.getByText('Bienvenue sur CongoMuv')).toBeInTheDocument();
    expect(screen.getByText(/Votre solution de transport au Congo/i)).toBeInTheDocument();
  });
});
