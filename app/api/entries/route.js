import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req) {
    const { id } = await req.json();

    // 验证ID格式
    const idPattern = /^\d{10}$/;
    if (!idPattern.test(id)) {
        return NextResponse.json({ message: '请输入学号哦！', id }, { status: 200 });
    }

    // 获取当前dataset
    const dataset = await db('dataset').select('student_id');
    const entry = dataset.find(entry => entry.student_id === id);

    if (entry) {
        // 如果ID已经在dataset里，查询是否获奖
        const prizeRecord = await db('results').where('student_id', id).select('prize_name').first();
        if (prizeRecord) {
            return NextResponse.json({ message: '恭喜你，中奖了！', prizeName: prizeRecord.prize_name, id }, { status: 200 });
        } else {
            return NextResponse.json({ message: '暂未中奖，请耐心等待！', id }, { status: 200 });
        }
    } else {
        // 如果ID不在dataset里，加入dataset
        await db('dataset').insert({ student_id: id });
        return NextResponse.json({ message: '已加入抽奖队列！', id }, { status: 200 });
    }
}

export async function GET() {
    const dataset = await db('dataset').select('student_id');
    return NextResponse.json({ dataset: dataset.map(entry => entry.student_id) }, { status: 200 });
}

export async function DELETE() {
    await db('dataset').truncate();
    await db('results').truncate();
    return NextResponse.json({ message: 'Dataset and results cleared.' }, { status: 200 });
}
