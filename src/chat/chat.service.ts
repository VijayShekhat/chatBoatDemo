import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import Groq from 'groq-sdk';

@Injectable()
export class ChatService implements OnModuleInit {
  private readonly logger = new Logger(ChatService.name);
  private companyData: string;
  private groq: Groq;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const dataPath = path.join(process.cwd(), 'data', 'company-info.txt');
    try {
      this.companyData = fs.readFileSync(dataPath, 'utf-8');
      this.logger.log('Company data loaded successfully');
    } catch (error) {
      this.logger.error(`Failed to load company data from ${dataPath}`);
      this.companyData = '';
    }

    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      this.logger.error('GROQ_API_KEY is not set in environment variables');
    }
    this.groq = new Groq({ apiKey });
  }

  async getReply(userMessage: string): Promise<string> {
    if (!this.companyData) {
      return "I don't have enough information about it, please contact operator.";
    }

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a helpful company assistant. Answer questions ONLY using the company information provided below. If the answer is not found in the provided data, respond exactly with: "I don't have enough information about it, please contact operator." Do not make up or assume any information beyond what is provided.\n\n--- COMPANY INFORMATION ---\n${this.companyData}\n--- END OF COMPANY INFORMATION ---`,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 512,
      });

      return (
        chatCompletion.choices[0]?.message?.content ||
        "I don't have enough information about it, please contact operator."
      );
    } catch (error) {
      this.logger.error('Groq API error:', error.message);
      return 'Sorry, something went wrong. Please try again later.';
    }
  }
}
