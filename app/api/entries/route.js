import { kv } from '../../../lib/kv';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { id } = await req.json();
    const n = parseInt(await kv.get('lottery_limit'), 10) || parseInt(process.env.LOTTERY_LIMIT, 10);

    // 验证ID格式
    const idPattern = /^20\d{8}$/;
    if (!idPattern.test(id)) {
        return NextResponse.json({ message: '请输入学号哦！', id }, { status: 200 });
    }

    let entries = await kv.get('entries') || [];

    // 检查重复ID
    if (entries.includes(id)) {
        const prizeName = await kv.get('prize_name') || 'No prize set';
        return NextResponse.json({ message: '你已经中过奖了！', prizeName, id }, { status: 200 });
    }

    if (entries.length < n) {
        entries.push(id);
        await kv.set('entries', entries);
        const prizeName = await kv.get('prize_name') || 'No prize set';
        return NextResponse.json({ message: '恭喜你！中奖了：', prizeName, id }, { status: 200 });
    } else {
        return NextResponse.json({ message: '很遗憾，没有中奖，下回再试试吧！', prizeName, id }, { status: 200 });
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
