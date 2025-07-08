'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !onReorder) return;

    if (active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);

      const newSectionOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      onReorder(newSectionOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
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
    </DndContext>
  );
};
