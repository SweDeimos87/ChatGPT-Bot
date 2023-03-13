require("dotenv").config();

// Connection to Discord API
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Connection to OpenAI API
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// Check for when a message on discord is sent
client.on("messageCreate", async function (message) {
  try {
    // Dont respond to self
    if (message.author.bot) return;

    const gptResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `ChatGPT is a friendly chatbot.\n\
ChatGPT: Hello, how are you?\n\
${message.author.username}: ${message.content}\n\
ChatGPT:`,
      temperature: 0.9,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
    });

    message.reply(`${gptResponse.data.choices[0].text}`);
    return;
  } catch (err) {
    console.log(err);
  }
});

// Log the bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT Bot is Online on Discord");
