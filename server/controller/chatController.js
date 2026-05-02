import { GoogleGenAI } from '@google/genai'
import Event from '../models/eventModel.js'
import Order from '../models/orderModel.js'
import Comment from '../models/commentModel.js'
import Coupon from '../models/couponModel.js'

// AI client initialized lazily inside giveAnswer

const SYSTEM_PROMPT = `You are "Distriq Buddy", the super-chill AI assistant for the Distriq platform.

PERSONALITY:
- Your vibe is casual, friendly, and slightly funny. 
- LANGUAGE MATCHING: If the user asks in English, reply in English. If the user asks in Hinglish (Hindi + English), reply in Hinglish.
- Use phrases like "Bhai", "Dost", "Sahi hai", "Mast" (only in Hinglish mode).

RESPONSE FORMAT:
You MUST reply with a JSON object. No other text.
Example:
{
  "text": "Hello Bhai!",
  "events": []
}

If you find events, put them in the "events" array. 
IMPORTANT: Use the "_id" field from the context as the "id" in your response.
{
  "text": "Check these events!",
  "events": [{"id": "64f... (the _id from context)", "title": "Party", "date": "10 Aug", "location": "Mumbai", "price": "₹500"}]
}

RULES:
- If no events are relevant, leave the "events" array empty [].
- "text" should contain your friendly response and any additional info.
- NEVER use markdown symbols like (*) or (#) in the "text" field.
- Suggest only 2-3 most relevant events from the context.
- Keep the natural response concise.`

const giveAnswer = async (req, res) => {
    const { text } = req.body

    if (!text) {
        res.status(400)
        throw new Error('Please ask a question!')
    }

    try {
        // Fetch context data (Limited to prevent prompt overflow)
        const events = await Event.find({ isActive: true }).sort({ createdAt: -1 }).limit(10).lean()
        const orders = await Order.find({ user: req?.user?._id || null }).populate('event').limit(5).lean()
        const coupons = await Coupon.find({ isActive: true }).limit(5).lean()

        const contextData = `
EVENTS:
${JSON.stringify(events, null, 2)}

USER BOOKINGS:
${JSON.stringify(orders, null, 2)}

ACTIVE COUPONS:
${JSON.stringify(coupons, null, 2)}
`

        const prompt = `${SYSTEM_PROMPT}

CONTEXT DATA:
${contextData}

USER QUESTION: ${text}

Answer:`

        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })



        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [prompt],
        })

        let answer = typeof response.text === 'function' ? response.text() : response.text

        if (!answer || typeof answer !== 'string') {
            answer = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }



        // Handle potential JSON wrapping in markdown
        let jsonContent = answer;
        if (answer.includes('```')) {
            const match = answer.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (match) jsonContent = match[1];
        }

        let finalResponse;
        try {
            const parsed = JSON.parse(jsonContent);
            // Cleanup any stray markdown in the text field
            if (parsed.text && typeof parsed.text === 'string') {
                parsed.text = parsed.text.replace(/[*#]/g, '').trim();
            }
            finalResponse = parsed;
        } catch (e) {
            console.error('JSON Parse Error:', e.message, 'on content:', jsonContent);
            // Fallback if AI fails to return valid JSON
            finalResponse = {
                text: answer.replace(/[*#]/g, '').trim(),
                events: []
            };
        }

        res.status(200).json(finalResponse)
    } catch (err) {
        console.error('AI error details:', err)
        if (err.status === 429) {
            res.status(429)
            throw new Error('AI quota exceeded. Please try again later.')
        }
        res.status(500)
        throw new Error('AI service failed. Please try again.')
    }
}

export default giveAnswer