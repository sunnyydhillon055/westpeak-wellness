'use client';

import { useRef, type MouseEvent } from 'react';
import { track } from '@/lib/analytics';

/* A TOOL'S FIRST INPUT, ONCE PER VIEW — 15 Oct 2026.
 *
 * tool_complete alone cannot tell "nobody opened it" from "people began and
 * gave up". Quiz.tsx has fired tool_start on the first answer since the
 * quizzes were built (it was dropped by the counter until now); the two form
 * tools fire it here, from the first change or the first press of a control
 * inside them. Spread the handlers on the tool's outer element. The tool's
 * name is the only detail; nothing typed is read. */
export function useToolStart(tool: string) {
  const started = useRef(false);
  const start = () => {
    if (started.current) return;
    started.current = true;
    track('tool_start', { tool, detail: tool });
  };
  return {
    onChangeCapture: start,
    onClickCapture: (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('button, select, input')) start();
    },
  };
}
