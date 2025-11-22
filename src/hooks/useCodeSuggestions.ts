import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { CodeSuggestion } from '../data/codes';

export function useCodeSuggestions() {
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'code_suggestions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CodeSuggestion[];
      setSuggestions(loaded);
    }, (error) => {
      console.error("Error fetching code suggestions:", error);
    });
    return () => unsubscribe();
  }, []);

  const addSuggestion = async (data: Omit<CodeSuggestion, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'code_suggestions'), {
        ...data,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error adding suggestion:", e);
    }
  };

  const deleteSuggestion = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'code_suggestions', id));
    } catch (e) {
      console.error("Error deleting suggestion:", e);
    }
  };

  return { suggestions, addSuggestion, deleteSuggestion };
}