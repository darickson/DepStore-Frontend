import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';

const HomeWithRouter = () => (
  <BrowserRouter>
    <Home />
  </BrowserRouter>
);

describe('Home Page DEP URBAN', () => {
  it('renderiza el título principal de la tienda', () => {
    render(<HomeWithRouter />);
    // Buscar el título principal
    const title = screen.getByText(/DEP URBAN/i);
    expect(title).toBeTruthy();
  });

  it('renderiza contenido de la tienda', () => {
    render(<HomeWithRouter />);
    // Verificar que hay algún botón o elemento interactivo
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
