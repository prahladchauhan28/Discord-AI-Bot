import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleGenAI } from '@google/genai';

// Initialize Google Generative AI client
const googleAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Create Discord bot client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Event: Bot is online
client.once("ClientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Event: Reply to all messages
client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // prevent infinite loops

  try {
    // Send user message to Gemini model
   const response = await googleAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [message.content],
  });
    // Get text response
    const aiResponse = response.text;

    // Reply back
    await message.reply(`🤖 ${aiResponse}`);
  } catch (err) {
    console.error("Gemini API Error:", err);
    await message.reply("⚠️ Sorry, I couldn't process that.");
  }
});

// Login bot
client.login(process.env.DISCORD_TOKEN);
