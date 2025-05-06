const express = require('express');
const router = express.Router();
const db = require("../config/db");

// 전체 랭킹 (왕관 많은 순)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT USERNAME, CROWN_CNT, PROFILE_IMG
            FROM USERS
            ORDER BY CROWN_CNT DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: '랭킹 조회 실패' });
    }
});

module.exports = router;