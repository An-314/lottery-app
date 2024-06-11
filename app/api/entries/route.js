import { collection, getDocs, addDoc, query, orderBy, limit, deleteDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const settingsDocRef = doc(db, 'settings', 'maxEntries');

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
        console.log('Starting POST request handling');

        const newEntry = await request.json();
        console.log('Received new entry:', newEntry);

        const q = query(collection(db, 'entries'), orderBy('timestamp'), limit(30));
        const querySnapshot = await getDocs(q);
        console.log('Current entries count:', querySnapshot.size);

        // 获取maxEntries的值
        const settingsDoc = await getDoc(settingsDocRef);
        let maxEntries;
        if (settingsDoc.exists()) {
            maxEntries = settingsDoc.data().maxEntries;
            console.log('Fetched maxEntries from settings:', maxEntries);
        } else {
            // 如果文档不存在，设置默认值并创建文档
            maxEntries = 30;
            console.log('Settings document does not exist, setting default maxEntries:', maxEntries);
            await setDoc(settingsDocRef, { maxEntries });
        }

        if (querySnapshot.size >= maxEntries) {
            console.log('Max entries reached, draw is closed');
            return new Response(JSON.stringify({ error: 'The draw is closed.' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        await addDoc(collection(db, 'entries'), {
            userId: newEntry.userId,
            timestamp: Timestamp.now(),
        });
        console.log('New entry added successfully');

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
