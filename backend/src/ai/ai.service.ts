import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      // baseURL: 'https://api.deepseek.com', // Указываем адрес DeepSeek
      baseURL: 'https://openrouter.ai/api/v1', // OpenRouter
      apiKey: process.env.DEEPSEEK_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000', // Обязательно для OpenRouter
        'X-Title': 'shop-app', // Название твоего проекта
      },
    });
  }

  async getStylistAdvice(
    productTitle: string,
    categories: string[],
    lang: string,
    history: {
      role: string;
      text: string;
    }[],
  ) {
    const responseLanguage = lang === 'en' ? 'English' : 'Russian';

    const systemInstruction = `
      You are a professional AI Stylist for the "Minimalist" fashion brand.
  
      STRICT RULES:
      1. ANSWER LENGTH: Keep your response under 3-4 short sentences (max 60 words). Be very concise.
      2. FORMATTING: Use bullet points for suggestions. Do not write long paragraphs.
      3. TONE: Professional, minimalist, and direct.
      4. If the user asks something unrelated to fashion, decline politely.
      
      Context: Current product is "${productTitle}".
      Answer in ${responseLanguage}.
    `;

    const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      history.map((msg) => {
        return {
          role: msg.role === 'ai' ? 'assistant' : 'user',
          content: msg.text,
        };
      });

    try {
      const completion = await this.openai.chat.completions.create({
        // model: 'stepfun/step-3.5-flash:free',
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          { role: 'system', content: systemInstruction },
          ...apiMessages,
        ],
      });

      return completion.choices[0]?.message?.content || '...';
    } catch (error) {
      console.error('AI Error:', error);
      return lang === 'en'
        ? 'Service unavailable'
        : 'Сервис временно недоступен';
    }
  }
}
