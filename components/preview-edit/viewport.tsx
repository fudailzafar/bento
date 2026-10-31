'use client';

import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ViewMode } from '@/components/preview';

// The editor's canvas: the page at full width on desktop, or inside a rounded
// phone frame in the phone view. Switching from the dock grows or shrinks the
// frame, and the grid inside re-flows between bento's two layouts.
export function EditorViewport({
  viewMode,
  children,
}: {
  viewMode: ViewMode;
  children: (viewMode: ViewMode) => ReactNode;
}) {
  return (
    <div
      className={`flex flex-1 items-center justify-center ${viewMode === 'mobile' ? 'bg-[#f8f8f8] pb-24' : 'xl:pb-24'}`}
    >
      <AnimatePresence mode="wait">
        {viewMode === 'mobile' ? (
          /* Mobile View */
          <motion.div
            key="mobile"
            initial={{ opacity: 0, width: '100%', maxWidth: '768px' }}
            animate={{ opacity: 1, width: '430px', maxWidth: '430px' }}
            exit={{ opacity: 0, width: '100%', maxWidth: '768px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
            style={{ height: 'min(80vh, 900px)' }}
          >
            <div className="relative h-full w-full">
              <motion.div
                initial={{ borderRadius: '0.5rem' }}
                animate={{ borderRadius: '4.5rem' }}
                exit={{ borderRadius: '0.5rem' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full w-full overflow-hidden border border-gray-200 bg-white shadow-lg"
              >
                {/* Scrollable Content */}
                <div className="scrollbar-hide h-full w-full overflow-y-auto overflow-x-hidden bg-background">
                  <motion.div
                    initial={{
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                    }}
                    // 24px each side leaves bento's 380px phone grid in
                    // the 428px inside the frame's border.
                    animate={{
                      paddingLeft: '1.5rem',
                      paddingRight: '1.5rem',
                    }}
                    exit={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {children(viewMode)}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* Desktop View */
          <motion.div
            key="desktop"
            initial={{ opacity: 0, width: '430px', maxWidth: '430px' }}
            animate={{ opacity: 1, width: '100%', maxWidth: '1400px' }}
            exit={{ opacity: 0, width: '430px', maxWidth: '430px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex items-center justify-between xl:rounded-lg"
          >
            <motion.div
              initial={{ borderRadius: '2.5rem' }}
              animate={{ borderRadius: '0.5rem' }}
              exit={{ borderRadius: '2.5rem' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full px-6 xl:px-4"
            >
              {children(viewMode)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
