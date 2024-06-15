import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req) {
    const { prizeName } = await req.json();
    await db('settings').insert({ key: 'prize_name', value: prizeName }).onConflict('key').merge();
    return NextResponse.json({ message: `Prize name set to ${prizeName}.` }, { status: 200 });
}

export async function GET() {
    const prizeName = await db('settings').where('key', 'prize_name').select('value').first();
    return NextResponse.json({ prizeName: prizeName ? prizeName.value : 'No prize set' }, { status: 200 });
}
