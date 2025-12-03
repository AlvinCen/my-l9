import { useState, useEffect } from 'react';
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { MaintenanceInfo } from '../types';
import { db } from '@/firebase.tsx';

export function useMaintenance() {
    const [maintenanceRecords, setMaintenanceRecords] = useState<(MaintenanceInfo & { id: string })[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'maintenance'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loaded = snapshot.docs.map(doc => ({
                id: doc.id,
                region: doc.data().region,
                lastCompletedAt: doc.data().lastCompletedAt,
            }));
            setMaintenanceRecords(loaded);
        }, (error) => {
            console.error("Error fetching maintenance records:", error);
        });

        return () => unsubscribe();
    }, []);

    const addMaintenance = async (region: string, completedAt: Date) => {
        try {
            await addDoc(collection(db, 'maintenance'), {
                region,
                lastCompletedAt: completedAt.toISOString(),
            });
            console.log("Maintenance record added successfully");
        } catch (e) {
            console.error("Error adding maintenance record: ", e);
            throw e;
        }
    };

    const deleteMaintenance = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'maintenance', id));
            console.log("Maintenance record deleted");
        } catch (e) {
            console.error("Error deleting maintenance: ", e);
            throw e;
        }
    };

    return { maintenanceRecords, addMaintenance, deleteMaintenance };
}
