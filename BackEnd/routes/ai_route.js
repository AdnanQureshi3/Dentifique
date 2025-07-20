import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'


const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY)


router.post('/enhancedText', async (req, res) => {
  const { text } = req.body
  console.log(text , "YES I AM RECEIVING TEXT MESSAGES");

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
   const result = await model.generateContent(`Enhance this text, please dont replace html tags:\n\n${text}`);

    res.json({result});
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to enhance text' })
  }
})

export default router
