import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { OperatorDashboard } from '../OperatorDashboard';

// Mock des composants enfants pour simplifier les tests
jest.mock('../../components/operator/TripsManagement', () => ({
  TripsManagement: () => <div data-testid="trips-management">Gestion des trajets</div>,
}));

jest.mock('../../components/operator/BookingsManagement', () => ({
  BookingsManagement: () => <div data-testid="bookings-management">Gestion des réservations</div>,
}));

describe('OperatorDashboard', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <OperatorDashboard />
      </BrowserRouter>
    );
  };

  it('affiche le tableau de bord avec les sections principales', () => {
    renderComponent();
    // Vérifier que les composants mappés sont présents
    expect(screen.getByText('Gestion des trajets')).toBeInTheDocument();
    expect(screen.getByText('Gestion des réservations')).toBeInTheDocument();
  });
});
