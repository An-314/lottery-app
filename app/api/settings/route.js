import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const settingsDocRef = doc(db, 'settings', 'maxEntries');

export async function GET() {
    try {
        const docSnap = await getDoc(settingsDocRef);
        if (docSnap.exists()) {
            return new Response(JSON.stringify(docSnap.data()), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            return new Response(JSON.stringify({ maxEntries: 30 }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error('Failed to fetch max entries:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch max entries' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function POST(request) {
    try {
        const { maxEntries } = await request.json();
        await setDoc(settingsDocRef, { maxEntries }, { merge: true });
        return new Response(JSON.stringify({ message: 'Max entries updated successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Failed to set max entries:', error);
        return new Response(JSON.stringify({ error: 'Failed to set max entries' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
