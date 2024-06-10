import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'entries.json');

export async function GET(request) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return new Response(JSON.stringify(JSON.parse(data)), {
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
        const data = JSON.parse(await fs.readFile(filePath, 'utf8'));

        if (Object.keys(data).length >= 30) {
            return new Response(JSON.stringify({ error: 'The draw is closed.' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        data[newEntry.userId] = newEntry.timestamp;
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        return new Response(JSON.stringify(data), {
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
