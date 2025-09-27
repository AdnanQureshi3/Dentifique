import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Message from "../models/message_Model.js";
import { parse } from 'dotenv';
import isAuthenticated from "../middleware/isAuth.js";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY)


router.post('/enhancedText', async (req, res) => {
    const { text, title } = req.body;
    console.log(text , title , "enhancing")
  
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    let prompt = '';
    
    try {
               if (text && text.length > 10) {
            prompt = `Your task is to enhance the grammar, clarity, and tone of the following text without changing its original meaning.

Rules:
- Write in a natural, casual, and human-like voice, avoiding overly formal or verbose language.
- Ensure the flow and rhythm of the sentences are conversational.
- Do NOT add or remove any content.
- Preserve all HTML tags exactly as they are.
- Keep any emojis unchanged.
- Return ONLY the improved version.

Text:
${text}`;
        } else if (title) {
            prompt = `Write a short article (max 500 words) based on the given title.

Style Guidelines:
- Adopt a natural, informal, and engaging human tone.
- Use a mix of short, punchy sentences and slightly longer, descriptive sentences.
- Avoid overly academic or repetitive phrasing (like "embarking on a journey").

Formatting:
- Use bold and underline for important words.
- Add relevant emojis.
- Make it engaging and concise.

Title: ${title}`;
        } else {
            return res.status(400).json({ error: 'Missing required text or title for AI generation.' });
        }

        const result = await model.generateContent(prompt);
       

        res.json({  result });
        
    } catch (err) {
     
        console.error("--- AI Generation Error ---");
        console.error(err); 
        console.error("---------------------------");

        res.status(500).json({ error: 'Failed to process request with AI model.' });
    }
});

router.post('/title', async (req, res) => {
  const { text } = req.body
  //   console.log(text , "YES I AM RECEIVING TEXT MESSAGES");

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
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
    let parsedMessages = "";
    messages.map(msg => {
    
      let str = msg.senderId == userId ? "Me" : "other";
      parsedMessages += `${str} : ${msg.message}\n`;
    });
    


    return parsedMessages;
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};



router.post('/reply', isAuthenticated, async (req, res) => {
  const { tone , description , messagesArray } = req.body
  const userId = req.id;
    // console.log(messagesArray , tone , description ,"YES I AM RECEIVING TEXT MESSAGES");

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const parsedConversation  = await handleAiSelectedMessages(userId, messagesArray);
    console.log(parsedConversation , "PARSED CONVERSATION");

  const result = await model.generateContent(
  `You are an AI assistant. Your task is to generate a concise, engaging, and casual reply in a ${tone} tone to the following conversation.

Messages:
${parsedConversation}

Extra context from user:
${description}
Focus on tone , description and conversation and DONT USE * * ok, i repeat dont use astrick sign
 ${description} ok 

Reply:`
);

    // console.log(result , "AI REPLY RESULT");

    res.json({ result });
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate reply.' })
  }
})



export default router
