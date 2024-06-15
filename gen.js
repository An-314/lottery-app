const db = require('./lib/db'); // 假设db模块已经配置好

async function insertRandomEntries() {
    const entries = [];
    for (let i = 0; i < 100; i++) {
        const randomId = generateRandomId();
        entries.push({ student_id: randomId });
    }

    try {
        await db('dataset').insert(entries);
        console.log('Successfully inserted 100 random entries into the dataset.');
    } catch (error) {
        console.error('Error inserting entries:', error);
    } finally {
        db.destroy(); // 关闭数据库连接
    }
}

function generateRandomId() {
    let id = '20';
    for (let i = 0; i < 8; i++) {
        id += Math.floor(Math.random() * 10).toString();
    }
    return id;
}

insertRandomEntries();
