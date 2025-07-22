import { useState, useEffect, useCallback } from 'react';
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'PromptMeshDB';
const STORE_NAME = 'customAvatar';

interface CustomAvatar {
    id: number;
    glb: Blob;
    rotationY: number;
}

async function getDB(): Promise<IDBPDatabase> {
    return await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        }
    });
}

export function useCustomAvatar() {
    const [avatar, setAvatar] = useState<CustomAvatar | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadAvatar = useCallback(async () => {
        setIsLoading(true);
        try {
            const db = await getDB();
            const storedAvatar = await db.get(STORE_NAME, 1);
            if (storedAvatar) {
                setAvatar(storedAvatar);
            }
        } catch (error) {
            console.error('Error loading custom avatar:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAvatar();
    }, [loadAvatar]);

    const saveAvatar = async (glb: Blob, rotationY: number) => {
        const db = await getDB();
        const newAvatar: CustomAvatar = { id: 1, glb, rotationY };
        await db.put(STORE_NAME, newAvatar);
        setAvatar(newAvatar);
    };

    const deleteAvatar = async () => {
        const db = await getDB();
        await db.delete(STORE_NAME, 1);
        setAvatar(null);
    };

    return { avatar, isLoading, saveAvatar, deleteAvatar, loadAvatar };
} 