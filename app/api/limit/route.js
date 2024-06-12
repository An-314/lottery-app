import { kv } from '../../../lib/kv';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { limit } = await req.json();
    await kv.set('lottery_limit', limit);
    return NextResponse.json({ message: `Lottery limit set to ${limit}.` }, { status: 200 });
}

export async function GET() {
    const limit = await kv.get('lottery_limit') || process.env.LOTTERY_LIMIT;
    return NextResponse.json({ limit }, { status: 200 });
}
