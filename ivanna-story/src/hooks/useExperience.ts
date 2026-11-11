import { useCallback, useReducer } from 'react';
import { config } from '../data/config';

export type Stage =
  | 'welcome'
  | 'letter'
  | 'verses'
  | 'confession'
  | 'cinematic'
  | 'wish'
  | 'thanks';

export const STAGE_ORDER: Stage[] = [
  'welcome',
  'letter',
  'verses',
  'confession',
  'cinematic',
  'wish',
  'thanks',
];

export type Answer = 'yes' | null;

interface State {
  stage: Stage;
  answer: Answer;
  /** bumps on replay so every section remounts from scratch */
  runId: number;
}

type Action =
  | { type: 'advance'; from: Stage }
  | { type: 'answer'; value: Answer }
  | { type: 'replay' };

const NEXT: Record<Stage, Stage | null> = {
  welcome: 'letter',
  letter: 'verses',
  verses: 'confession',
  confession: 'cinematic',
  cinematic: 'wish',
  wish: 'thanks',
  thanks: null,
};

/* ---- persistence: only remembers that the WhatsApp handoff happened ---- */
function readHandoff(): boolean {
  try {
    return localStorage.getItem(config.storageKey) === 'handoff';
  } catch {
    return false;
  }
}
function writeHandoff(on: boolean): void {
  try {
    if (on) localStorage.setItem(config.storageKey, 'handoff');
    else localStorage.removeItem(config.storageKey);
  } catch {
    /* storage unavailable (private mode etc.) — the experience still works */
  }
}

function init(): State {
  return readHandoff()
    ? { stage: 'thanks', answer: 'yes', runId: 0 }
    : { stage: 'welcome', answer: null, runId: 0 };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'answer':
      return { ...state, answer: action.value };
    case 'advance': {
      // Guard: a stale / duplicate call can never skip a stage.
      if (state.stage !== action.from) return state;
      const next = NEXT[state.stage];
      if (!next) return state;
      // The cinematic and wish stages require the YES answer.
      if ((next === 'cinematic' || next === 'wish') && state.answer !== 'yes') return state;
      return { ...state, stage: next };
    }
    case 'replay':
      return { stage: 'welcome', answer: null, runId: state.runId + 1 };
    default:
      return state;
  }
}

export function useExperience() {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  const advance = useCallback((from: Stage) => dispatch({ type: 'advance', from }), []);
  const setAnswer = useCallback((value: Answer) => dispatch({ type: 'answer', value }), []);
  const markHandoff = useCallback(() => writeHandoff(true), []);
  const replay = useCallback(() => {
    writeHandoff(false);
    dispatch({ type: 'replay' });
  }, []);

  return { ...state, advance, setAnswer, markHandoff, replay };
}
