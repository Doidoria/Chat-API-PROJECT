const { OpenAI } = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors()); // CORS 활성화
app.use(express.json()); // JSON 형태의 요청 본문(body)을 파싱할 수 있게 설정

// 기본적인 테스트 API
app.get('/', (req, res) => {
    res.send('AI Server is running!');
});

// AI 응답 처리 API (여기에 실제 로직을 추가)
app.post('/api/chat', async (req, res) => {
    // 1. 프론트엔드에서 보낸 메시지 받기
    const userInput = req.body.message;

    if (!userInput) {
        return res.status(400).json({ error: '메시지를 입력해주세요.' });
    }
    
    try {
        // 2. OpenAI API 호출
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // 사용하려는 모델 지정
            messages: [{ 
                role: "user", 
                content: userInput 
            }],
        });

        // 3. API 응답에서 텍스트 추출
        const aiResponse = completion.choices[0].message.content;

        // 4. 프론트엔드로 응답 전송
        res.json({ response: aiResponse });

    } catch (error) {
        console.error("OpenAI API 호출 에러:", error);
        res.status(500).json({ error: "AI 서버 응답 중 오류가 발생했습니다." });
    }
});