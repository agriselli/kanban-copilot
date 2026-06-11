'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, rectIntersection } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';

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

const initialColumns: Column[] = [
  {
    id: 'planning',
    title: 'Planning',
    cards: [
      { id: 'card-1', title: 'Team kickoff', details: 'Review goals and target dates.' },
      { id: 'card-2', title: 'Define scope', details: 'Agree on core features for the MVP.' },
    ],
  },
  {
    id: 'design',
    title: 'Design',
    cards: [
      { id: 'card-3', title: 'Wireframes', details: 'Create layout and interaction structure.' },
    ],
  },
  {
    id: 'development',
    title: 'Development',
    cards: [
      { id: 'card-4', title: 'Build board UI', details: 'Implement columns, cards, and drag-and-drop.' },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    cards: [
      { id: 'card-5', title: 'UX review', details: 'Collect feedback from the design team.' },
    ],
  },
  {
    id: 'launch',
    title: 'Launch',
    cards: [
      { id: 'card-6', title: 'Prepare demo', details: 'Confirm board behavior and visuals.' },
    ],
  },
];

const emptyFormState: FormState = { title: '', details: '' };

function createCardId() {
  return `card-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [columnForms, setColumnForms] = useState<Record<string, FormState>>(
    Object.fromEntries(initialColumns.map((column) => [column.id, emptyFormState]))
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleRename = (columnId: string, value: string) => {
    setColumns((current) =>
      current.map((column) => (column.id === columnId ? { ...column, title: value } : column))
    );
  };

  const handleNewCardChange = (columnId: string, field: keyof FormState, value: string) => {
    setColumnForms((current) => ({
      ...current,
      [columnId]: { ...current[columnId], [field]: value },
    }));
  };

  const handleAddCard = (columnId: string) => {
    const formState = columnForms[columnId];
    if (!formState.title.trim() || !formState.details.trim()) {
      return;
    }

    const newCard: Card = {
      id: createCardId(),
      title: formState.title.trim(),
      details: formState.details.trim(),
    };

    setColumns((current) =>
      current.map((column) =>
        column.id === columnId
          ? { ...column, cards: [...column.cards, newCard] }
          : column
      )
    );

    setColumnForms((current) => ({
      ...current,
      [columnId]: emptyFormState,
    }));
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    setColumns((current) =>
      current.map((column) =>
        column.id === columnId
          ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) }
          : column
      )
    );
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    const sourceColumn = columns.find((column) =>
      column.cards.some((card) => card.id === active.id)
    );
    const destinationColumn =
      columns.find((column) => column.id === over.id) ||
      columns.find((column) => column.cards.some((card) => card.id === over.id));

    if (!sourceColumn || !destinationColumn || sourceColumn.id === destinationColumn.id) {
      return;
    }

    const cardToMove = sourceColumn.cards.find((card) => card.id === active.id);
    if (!cardToMove) {
      return;
    }

    setColumns((current) =>
      current.map((column) => {
        if (column.id === sourceColumn.id) {
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== active.id),
          };
        }

        if (column.id === destinationColumn.id) {
          return {
            ...column,
            cards: [...column.cards, cardToMove],
          };
        }

        return column;
      })
    );
  };

  return (
    <section>
      <div className="board-title">
        <div>
          <h1>Kanban Project Manager</h1>
          <p>One board, five renameable columns, drag cards between stages, and add or remove tasks instantly.</p>
        </div>
      </div>
      <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
        <div className="board" role="list">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              formState={columnForms[column.id]}
              onRename={handleRename}
              onNewCardChange={handleNewCardChange}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </div>
      </DndContext>
    </section>
  );
}
