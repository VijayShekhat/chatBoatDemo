import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Message cannot be empty' })
  message: string;
}

export class ChatResponseDto {
  reply: string;
}
