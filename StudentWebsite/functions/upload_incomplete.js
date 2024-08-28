const express = require('express');
const multer = require('multer');
const sql = require('mssql');

const app = express();
const upload = multer({ dest: '/tmp/uploads/incomplete/' }); // Netlify functions 使用 /tmp 目录

const config = {
    server: 'DESKTOP-J3R8Q2E',
    database: 'StudentDB',
    options: {
        trustServerCertificate: true,
    },
    authentication: {
        type: 'default'
    }
};

app.post('/upload_incomplete', upload.single('incompleteProgram'), async (req, res) => {
    const { file } = req;
    const studentName = "学生姓名"; // 从会话或表单中获取学生姓名
    const studentId = "学生学号"; // 从会话或表单中获取学生学号

    try {
        await sql.connect(config);
        const result = await sql.query`UPDATE Students SET IncompleteProgram = ${file.path} WHERE StudentNM = ${studentName} AND StudentId = ${studentId}`;
        res.send('文件上传成功，数据库更新成功。');
    } catch (err) {
        console.error(err);
        res.status(500).send('数据库操作失败');
    } finally {
        sql.close();
    }
});

module.exports.handler = (event, context) => {
    return new Promise((resolve, reject) => {
        app.handle(event, context, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};
