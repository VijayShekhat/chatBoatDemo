# Company AI Chatbot

An AI-powered chatbot built with NestJS and Groq that answers questions about your company using a text file as its knowledge base.

## Prerequisites

- **Node.js** v18 or higher
- **Groq API Key** (free) from [console.groq.com](https://console.groq.com)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure your API key**

   Copy the example env file and add your Groq API key:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and replace `your_groq_api_key_here` with your actual key.

3. **Add your company data**

   Edit `data/company-info.txt` with your real company information. The chatbot uses this file as its only knowledge source.

4. **Start the server**

   ```bash
   npm run start:dev
   ```

5. **Open the chatbot**

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

- The user types a question in the chat UI.
- The NestJS backend sends the question along with your company data to the Groq API.
- Groq's LLM generates an answer strictly from your company data.
- If no relevant answer exists in the data, the bot replies:
  *"I don't have enough information about it, please contact operator."*
