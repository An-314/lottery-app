import { kv } from '../../../lib/kv';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { id } = await req.json();
    const n = parseInt(await kv.get('lottery_limit'), 10) || parseInt(process.env.LOTTERY_LIMIT, 10);

    // // 验证ID格式
    // const idPattern = /^20\d{8}$/;
    // if (!idPattern.test(id)) {
    //     return NextResponse.json({ message: 'Invalid ID format. Please enter an ID in the format 20XXXXXXXX.' }, { status: 400 });
    // }

    let entries = await kv.get('entries') || [];

    // 检查重复ID
    if (entries.includes(id)) {
        return NextResponse.json({ message: 'This ID has already been submitted.' }, { status: 400 });
    }

    if (entries.length < n) {
        entries.push(id);
        await kv.set('entries', entries);
        return NextResponse.json({ message: 'You have entered the lottery!' }, { status: 200 });
    } else {
        return NextResponse.json({ message: 'Lottery is full. Try again next time!' }, { status: 200 });
    }
}

export async function GET() {
    const entries = await kv.get('entries') || [];
    return NextResponse.json({ entries }, { status: 200 });
}

export async function DELETE() {
    await kv.del('entries');
    return NextResponse.json({ message: 'Entries cleared.' }, { status: 200 });
}
