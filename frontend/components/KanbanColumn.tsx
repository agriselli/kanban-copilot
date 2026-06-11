'use client';

import { FormEvent } from 'react';
import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';

type Card = {
  id: string;
  title: string;
  details: string;
};

type Column = {
  id: string;
  title: string;
  cards: Card[];
};

type FormState = {
  title: string;
  details: string;
};

type Props = {
  column: Column;
  formState: FormState;
  onRename: (columnId: string, value: string) => void;
  onNewCardChange: (columnId: string, field: keyof FormState, value: string) => void;
  onAddCard: (columnId: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
};

export default function KanbanColumn({
  column,
  formState,
  onRename,
  onNewCardChange,
  onAddCard,
  onDeleteCard,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddCard(column.id);
  };

  return (
    <section ref={setNodeRef} className={`column${isOver ? ' dropping' : ''}`} aria-label={column.title} role="listitem">
      <div className="column-header">
        <label htmlFor={`column-name-${column.id}`}>Column title</label>
        <input
          id={`column-name-${column.id}`}
          type="text"
          value={column.title}
          onChange={(event) => onRename(column.id, event.target.value)}
          aria-label={`Rename ${column.title}`}
        />
      </div>
      <div className="card-list">
        {column.cards.map((card) => (
          <KanbanCard key={card.id} card={card} columnId={column.id} onDelete={onDeleteCard} />
        ))}
      </div>
      <form className="add-card-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Card title"
          value={formState.title}
          onChange={(event) => onNewCardChange(column.id, 'title', event.target.value)}
          aria-label={`New card title for ${column.title}`}
        />
        <textarea
          placeholder="Card details"
          value={formState.details}
          onChange={(event) => onNewCardChange(column.id, 'details', event.target.value)}
          aria-label={`New card details for ${column.title}`}
        />
        <button type="submit" disabled={!formState.title.trim() || !formState.details.trim()}>
          Add card
        </button>
      </form>
    </section>
  );
}
