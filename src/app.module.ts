import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TelegramBotModule } from '@/modules/telegram-bot.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TelegramBotModule
	],
})
export class AppModule {
}
