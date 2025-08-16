import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Message from "../models/message_Model.js";


const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY)


router.post('/enhancedText', async (req, res) => {
  const { text, title } = req.body
  //   console.log(text , "YES I AM RECEIVING TEXT MESSAGES");

  try {

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    let result = '';
    if (text.length > 10)
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
        `Write a short article 1500 chars based on the given title.
- Use **bold** and __underline__ for important words.
- Add  relevant emojis.
- Make it engaging and concise.

Title: ${title}`
      );



    res.json({ result });
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

    res.json({ result });
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to Genearte Title.' })
  }
})


const handleAiSelectedMessages = async (userId , messagesArray) => {
  try {

    if (!messagesArray || !messagesArray.length) {
      return res.status(400).json({ success: false, msg: "No messages selected" });
    }

    const messages = await Message.find({ _id: { $in: messagesArray } }).lean();

    // Parse messages into AI-friendly format
    const parsedConversation = messages.map(msg => ({
      role: msg.senderId.toString() === userId ? "user" : "other",
      content: msg.message 
    }));


    return parsedConversation;
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};



router.post('/reply', async (req, res) => {
  const { tone , description , messagesArray } = req.body
    // console.log(messagesArray , tone , description ,"YES I AM RECEIVING TEXT MESSAGES");

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const parsedConversation  = await handleAiSelectedMessages(req.id, messagesArray);

    const result = await model.generateContent(
      `Your task is to generate a concise and engaging reply with ${tone} to the following message.  
Messages:
${ parsedConversation}
And some additional discription from user ${description}

Reply:`
    );
    console.log(result , "AI REPLY RESULT");

    res.json({ result });
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate reply.' })
  }
})



export default router
