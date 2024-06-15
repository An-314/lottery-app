import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req) {
    const { limit } = await req.json();
    await db('settings').insert({ key: 'lottery_limit', value: limit }).onConflict('key').merge();
    return NextResponse.json({ message: `Lottery limit set to ${limit}.` }, { status: 200 });
}

export async function GET() {
    const limit = await db('settings').where('key', 'lottery_limit').select('value').first();
    return NextResponse.json({ limit: limit ? limit.value : process.env.LOTTERY_LIMIT }, { status: 200 });
}
