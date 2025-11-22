import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { BossReport } from '../types';
import { db } from '@/firebase.tsx';

export function useBossReports() {
  const [reports, setReports] = useState<BossReport[]>([]);

  useEffect(() => {
    // Subscribe to boss_reports collection
    // Order by eventTime descending to match previous logic
    const q = query(collection(db, 'boss_reports'), orderBy('eventTime', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedReports = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          bossId: data.bossId,
          serverId: data.serverId,
          eventTime: data.eventTime,
          createdAt: data.createdAt,
          upvotes: data.upvotes || 0,
          downvotes: data.downvotes || 0,
        } as BossReport;
      });
      setReports(loadedReports);
    }, (error) => {
      console.error("Error fetching boss reports:", error);
    });

    return () => unsubscribe();
  }, []);

  const getReportsFor = (bossId: string, serverId: string): BossReport[] => {
    return reports
      .filter(r => r.bossId === bossId && r.serverId === serverId);
  };

  const addReport = async (data: { bossId: string; serverId: string; eventTime: Date }) => {
    console.log("Attempting to add report:", data);
    try {
      const docRef = await addDoc(collection(db, 'boss_reports'), {
        bossId: data.bossId,
        serverId: data.serverId,
        eventTime: data.eventTime.toISOString(),
        createdAt: new Date().toISOString(),
        upvotes: 1,
        downvotes: 0,
      });
      console.log("Report added successfully with ID:", docRef.id);
    } catch (e) {
      console.error("Error adding report: ", e);
      alert("Failed to add report. Check console for details.");
    }
  };

  const upvote = async (reportId: string) => {
    try {
      const reportRef = doc(db, 'boss_reports', reportId);
      await updateDoc(reportRef, {
        upvotes: increment(1)
      });
    } catch (e) {
      console.error("Error upvoting: ", e);
    }
  };

  const downvote = async (reportId: string) => {
    try {
      const reportRef = doc(db, 'boss_reports', reportId);
      await updateDoc(reportRef, {
        downvotes: increment(1)
      });
    } catch (e) {
      console.error("Error downvoting: ", e);
    }
  };

  return { reports, getReportsFor, addReport, upvote, downvote };
}
