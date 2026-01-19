// hooks/useHistory.ts
import { useState, useCallback } from "react";

export function useHistory<T>(initialPresent: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initialPresent);
  const [future, setFuture] = useState<T[]>([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture([present, ...future]);
    setPresent(previous);
    setPast(newPast);
    
    return previous; // Kembalikan state untuk digunakan caller
  }, [past, present, future, canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast([...past, present]);
    setPresent(next);
    setFuture(newFuture);

    return next;
  }, [past, present, future, canRedo]);

  const addNewState = useCallback((newState: T) => {
    setPast([...past, present]);
    setPresent(newState);
    setFuture([]); // Hapus future jika ada state baru (standard redo behavior)
  }, [past, present]);
  
  const resetHistory = useCallback((newState: T) => {
      setPast([]);
      setPresent(newState);
      setFuture([]);
  }, []);

  return { 
    state: present, 
    pushState: addNewState, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    resetHistory
  };
}