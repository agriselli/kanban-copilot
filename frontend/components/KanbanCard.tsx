'use client';

import { CSSProperties } from 'react';
import { useDraggable } from '@dnd-kit/core';

type Card = {
  id: string;
  title: string;
  details: string;
};

type Props = {
  card: Card;
  columnId: string;
  onDelete: (columnId: string, cardId: string) => void;
};

export default function KanbanCard({ card, columnId, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: card.id });

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <article ref={setNodeRef} className={`card${isDragging ? ' dragging' : ''}`} style={style} {...attributes}>
      <div className="card-handle" {...listeners} aria-label="Drag card">
        ⠿
      </div>
      <div>
        <h3 className="card-title">{card.title}</h3>
        <p className="card-details">{card.details}</p>
      </div>
      <div className="card-actions">
        <button type="button" className="delete-button" onClick={() => onDelete(columnId, card.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
