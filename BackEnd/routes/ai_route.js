import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'


const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY)


router.post('/enhancedText', async (req, res) => {
  const { text , title } = req.body
//   console.log(text , "YES I AM RECEIVING TEXT MESSAGES");

  try {
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    let result ='';
    if(text.length > 10)
  result = await model.generateContent(
  `Your task is to enhance the grammar, clarity, and tone of the following text without changing its original meaning.

Rules:
- Do NOT add or remove any content.
- Preserve all HTML tags exactly as they are.
- Keep any emojis unchanged.
- Return only the improved version.

Text:
${text}`
);

else
  result = await model.generateContent(
`Write a short article (max 500 characters) based on the given title.
- Use **bold** and __underline__ for important words.
- Add 2-3 relevant emojis.
- Make it engaging and concise.

Title: ${title}`
);



    res.json({result});
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to enhance text or Genrate text' })
  }
})

router.post('/title', async (req, res) => {
  const { text } = req.body
//   console.log(text , "YES I AM RECEIVING TEXT MESSAGES");

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(
  `Your task is to generate a catchy, accurate, and concise title (max 40 characters) for the following article text.

Guidelines:
- Keep the title short and attention-grabbing.
- It should clearly reflect the theme or mood of the text.
- Emojis can be added if they enhance clarity or appeal.
- Do NOT return any explanation, only the title.

Text:
${text}`
);

    res.json({result});
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to Genearte Title.' })
  }
})

export default router
