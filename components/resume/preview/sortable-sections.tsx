'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { DraggableSection } from './draggable-section';

export const SortableSections = ({
  sectionOrder,
  sectionComponents,
  isEditMode,
  onReorder,
}: {
  sectionOrder: string[];
  sectionComponents: Record<string, React.ReactNode>;
  isEditMode: boolean;
  onReorder?: (newOrder: string[]) => void;
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || !onReorder) return;

    if (active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);

      const newSectionOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      onReorder(newSectionOrder);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (!isEditMode) {
    return (
      <>
        {sectionOrder.map((sectionId) => (
          <div key={sectionId} className="mb-6">
            {sectionComponents[sectionId]}
          </div>
        ))}
      </>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={sectionOrder}
        strategy={verticalListSortingStrategy}
      >
        {sectionOrder.map((sectionId) => (
          <DraggableSection
            key={sectionId}
            id={sectionId}
            isEditMode={isEditMode}
          >
            {sectionComponents[sectionId]}
          </DraggableSection>
        ))}
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <div className="rounded-2xl shadow-2xl bg-white dark:bg-gray-900 opacity-95 px-4 py-4">
            {sectionComponents[activeId]}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
