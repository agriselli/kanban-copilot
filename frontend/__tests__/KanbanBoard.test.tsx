import { render, screen, fireEvent } from '@testing-library/react';
import KanbanBoard from '../components/KanbanBoard';

describe('KanbanBoard', () => {
  it('renders column headers and initial cards', () => {
    render(<KanbanBoard />);

    expect(screen.getByText('Kanban Project Manager')).toBeInTheDocument();
    expect(screen.getByLabelText('Rename Planning')).toBeInTheDocument();
    expect(screen.getByText('Team kickoff')).toBeInTheDocument();
  });

  it('adds a new card to a column', () => {
    render(<KanbanBoard />);

    const firstColumn = screen.getAllByPlaceholderText('Card title')[0];
    const firstDetails = screen.getAllByPlaceholderText('Card details')[0];
    const addButton = screen.getAllByRole('button', { name: /add card/i })[0];

    fireEvent.change(firstColumn, { target: { value: 'New task' } });
    fireEvent.change(firstDetails, { target: { value: 'New details here' } });
    fireEvent.click(addButton);

    expect(screen.getByText('New task')).toBeInTheDocument();
    expect(screen.getByText('New details here')).toBeInTheDocument();
  });

  it('deletes the team kickoff card when delete is clicked', () => {
    render(<KanbanBoard />);

    const teamCardTitle = screen.getByText('Team kickoff');
    const cardElement = teamCardTitle.closest('article');
    const deleteButton = cardElement?.querySelector('button.delete-button');

    expect(deleteButton).toBeTruthy();
    fireEvent.click(deleteButton!);

    expect(screen.queryByText('Team kickoff')).not.toBeInTheDocument();
  });
});
