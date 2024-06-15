import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST() {
    const limitRecord = await db('settings').where('key', 'lottery_limit').select('value').first();
    const n = limitRecord ? parseInt(limitRecord.value, 10) : parseInt(process.env.LOTTERY_LIMIT, 10);
    const prizeRecord = await db('settings').where('key', 'prize_name').select('value').first();
    const prizeName = prizeRecord ? prizeRecord.value : 'No prize set';

    // 获取所有entries和已有的获奖者
    const entries = await db('dataset').select('student_id');
    const existingWinners = await db('results').select('student_id');
    const existingWinnersSet = new Set(existingWinners.map(winner => winner.student_id));

    // 过滤掉已经获奖的entries
    const eligibleEntries = entries.filter(entry => !existingWinnersSet.has(entry.student_id));

    if (eligibleEntries.length === 0) {
        return NextResponse.json({ message: '没有可用的抽奖数据集。' }, { status: 200 });
    }

    // 随机选择获奖者
    const winners = [];
    while (winners.length < n && eligibleEntries.length > 0) {
        const randomIndex = Math.floor(Math.random() * eligibleEntries.length);
        const winner = eligibleEntries.splice(randomIndex, 1)[0];
        winners.push(winner);
        await db('results').insert({ student_id: winner.student_id, prize_name: prizeName });
    }

    return NextResponse.json({ message: `${winners.length} 名学生获奖。`, winners }, { status: 200 });
}
