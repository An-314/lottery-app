import { kv } from '../../../lib/kv';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { prizeName } = await req.json();
    await kv.set('prize_name', prizeName);
    return NextResponse.json({ message: `Prize name set to ${prizeName}.` }, { status: 200 });
}

export async function GET() {
    const prizeName = await kv.get('prize_name') || 'No prize set';
    return NextResponse.json({ prizeName }, { status: 200 });
}
