import { collection, getDocs, addDoc, query, orderBy, limit, deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export async function GET() {
    try {
        const q = query(collection(db, 'entries'), orderBy('timestamp'), limit(30));
        const querySnapshot = await getDocs(q);
        const entries = querySnapshot.docs.map(doc => doc.data());
        return new Response(JSON.stringify(entries), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Failed to read data:', error);
        return new Response(JSON.stringify({ error: 'Failed to read data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function POST(request) {
    try {
        const newEntry = await request.json();
        const q = query(collection(db, 'entries'), orderBy('timestamp'), limit(30));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size >= 30) {
            return new Response(JSON.stringify({ error: 'The draw is closed.' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        await addDoc(collection(db, 'entries'), {
            userId: newEntry.userId,
            timestamp: new Date(),
        });

        return new Response(JSON.stringify({ message: 'Data submitted successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Failed to write data:', error);
        return new Response(JSON.stringify({ error: 'Failed to write data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function DELETE() {
    try {
        const q = query(collection(db, 'entries'));
        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));

        await Promise.all(deletePromises);

        return new Response(JSON.stringify({ message: 'All data deleted successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Failed to delete data:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
