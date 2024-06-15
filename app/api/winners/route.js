import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
    const winners = await db('results').select('student_id', 'prize_name');
    return NextResponse.json({ winners }, { status: 200 });
}

export async function DELETE() {
    await db('results').truncate();
    return NextResponse.json({ message: 'Winners cleared.' }, { status: 200 });
}
