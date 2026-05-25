'use client';

import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ResumeDataSchemaType } from '@/lib';
import { 
  Square, 
  RectangleHorizontal, 
  RectangleVertical, 
  LayoutGrid, 
  Trash2, 
  Search, 
  Expand 
} from 'lucide-react';

const ResponsiveGridLayout = WidthProvider(Responsive);

export type GridWidgetData = NonNullable<ResumeDataSchemaType['layout']>[number];

interface BentoGridProps {
  isEditMode?: boolean;
  layoutData?: GridWidgetData[];
  onLayoutChange?: (newLayout: GridWidgetData[]) => void;
}

export function BentoGrid({
  isEditMode = false,
  layoutData = [],
  onLayoutChange,
}: BentoGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Map our data to react-grid-layout Layout objects
  const gridLayouts: Layout[] = layoutData.map((widget) => ({
    i: widget.id,
    x: widget.x,
    y: widget.y,
    w: widget.w,
    h: widget.h,
    minW: 1,
    minH: 1,
    maxW: 4,
    maxH: 4,
    isDraggable: isEditMode,
    isResizable: false, // Disabling freehand resize
  }));

  const handleGridLayoutChange = (currentLayout: Layout[]) => {
    if (!onLayoutChange) return;

    let hasChanges = false;
    const newLayoutData = layoutData.map((widget) => {
      const match = currentLayout.find((l) => l.i === widget.id);
      if (match && (match.x !== widget.x || match.y !== widget.y || match.w !== widget.w || match.h !== widget.h)) {
        hasChanges = true;
        return {
          ...widget,
          x: match.x,
          y: match.y,
          w: match.w,
          h: match.h,
        };
      }
      return widget;
    });

    if (hasChanges) {
      onLayoutChange(newLayoutData);
    }
  };

  const updateWidgetSize = (id: string, w: number, h: number) => {
    if (!onLayoutChange) return;
    const newLayout = layoutData.map((widget) =>
      widget.id === id ? { ...widget, w, h } : widget
    );
    onLayoutChange(newLayout);
  };

  const deleteWidget = (id: string) => {
    if (!onLayoutChange) return;
    const newLayout = layoutData.filter((widget) => widget.id !== id);
    onLayoutChange(newLayout);
  };

  if (!mounted) return null;

  return (
    <div className="mx-auto w-full max-w-[820px] pb-32">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: gridLayouts, md: gridLayouts, sm: gridLayouts, xs: gridLayouts, xxs: gridLayouts }}
        breakpoints={{ lg: 1200, md: 800, sm: 530, xs: 400, xxs: 0 }}
        cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={67.5}
        margin={[40, 40]}
        containerPadding={[0, 0]}
        onLayoutChange={(layout) => handleGridLayoutChange(layout)}
        isDraggable={isEditMode}
        isResizable={false} // Disable freehand resize globally
        compactType="vertical"
        useCSSTransforms={true}
      >
        {layoutData.map((widget) => {
          let content = null;

          if (widget.type === 'map') {
            content = (
              <div className="relative h-full w-full bg-blue-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" alt="Map" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-semibold shadow-sm flex items-center gap-1.5">
                  <span className="text-xl leading-none">🏡</span>
                  Where I live
                </div>
              </div>
            );
          } else if (widget.type === 'link') {
            content = (
              <div className="flex h-full w-full flex-col justify-between p-6 bg-white">
                <div className="size-12 overflow-hidden rounded-xl bg-gray-100 shadow-sm flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Figma_logo.svg" alt="App Icon" className="size-8" />
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-medium text-gray-900 leading-tight">
                    Camcord - Vlog your story
                  </h3>
                  <button className="rounded-full bg-blue-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-600">
                    Get
                  </button>
                </div>
              </div>
            );
          } else if (widget.type === 'sectionTitle') {
            content = (
              <div className="flex h-full w-full items-center px-6 bg-white">
                <h2 className="text-xl font-bold tracking-tight text-gray-900">
                  Section Title
                </h2>
              </div>
            );
          } else if (widget.type === 'image') {
            content = (
              <div className="h-full w-full overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800" alt="Image" className="h-full w-full object-cover" />
              </div>
            );
          } else {
             content = (
               <div className="flex h-full w-full flex-col items-center justify-center bg-white p-4">
                <span className="text-sm font-semibold text-gray-500">
                  {widget.type}
                </span>
               </div>
             );
          }

          return (
            <div
              key={widget.id}
              className={`group relative overflow-visible rounded-[2rem] border border-gray-100 bg-white transition-shadow ${
                isEditMode ? 'cursor-grab active:cursor-grabbing hover:shadow-lg hover:z-50' : ''
              }`}
              style={{
                boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Inner container to clip widget content so menus can overflow */}
              <div className="h-full w-full overflow-hidden rounded-[2rem]">
                {content}
              </div>

              {/* Edit Mode Overlays */}
              {isEditMode && (
                <>
                  {/* Delete Button (Top Left) */}
                  <button
                    onPointerDown={(e) => { e.stopPropagation(); deleteWidget(widget.id); }}
                    className="absolute -left-3 -top-3 flex size-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15)] opacity-0 transition-opacity group-hover:opacity-100 hover:scale-105 hover:text-red-500 z-50"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* Resize Toolbar (Bottom Center) - hidden for sectionTitle since it's fixed size */}
                  {widget.type !== 'sectionTitle' && (
                    <div 
                      onPointerDown={(e) => e.stopPropagation()} 
                      className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-[1.25rem] bg-black px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.2)] opacity-0 transition-opacity group-hover:opacity-100 z-50"
                    >
                      <button
                        onClick={() => updateWidgetSize(widget.id, 1, 2)}
                        className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                          widget.w === 1 && widget.h === 2 ? 'bg-white text-black' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <Square size={16} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => updateWidgetSize(widget.id, 2, 2)}
                        className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                          widget.w === 2 && widget.h === 2 ? 'bg-white text-black' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <RectangleHorizontal size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => updateWidgetSize(widget.id, 1, 4)}
                        className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                          widget.w === 1 && widget.h === 4 ? 'bg-white text-black' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <RectangleVertical size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => updateWidgetSize(widget.id, 2, 4)}
                        className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                          widget.w === 2 && widget.h === 4 ? 'bg-white text-black' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <LayoutGrid size={18} strokeWidth={2.5} />
                      </button>
                    
                    <div className="mx-1 h-5 w-[1px] bg-gray-700" />
                    
                    <button className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                      <Expand size={16} strokeWidth={2.5} />
                    </button>
                    <button className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                      <Search size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}
