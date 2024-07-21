import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Markup, Telegraf } from 'telegraf';
import { AuthDto } from '@/dto/auth.dto';

@Injectable()
export class TelegramBotService implements OnModuleInit {
	private bot: Telegraf;

	constructor(private configService: ConfigService) {}

	async onModuleInit() {
		await this.initializeBot();
	}

	private async initializeBot() {
		try {
			this.bot = new Telegraf(this.configService.get('TELEGRAM_TOKEN'));

			this.bot.command('start', async (ctx) => {
				const user: AuthDto = ctx.message.from;

				const userDataString = JSON.stringify(user);

				const webAppUrl = `${this.configService.get('WEB_APP_URL')}?data=${encodeURIComponent(userDataString)}`;

				await ctx.reply('Привет! Я уже работаю.', Markup.inlineKeyboard([
					Markup.button.webApp('Открыть веб-приложение', webAppUrl),
				]));
			});

			this.bot.command('help', (ctx) => {
				ctx.reply('Вот список доступных команд:\n/start - Начать\n/help - Помощь');
			});

			await this.bot.launch();
			console.log('Telegram бот запущен');
		} catch (err) {
			console.error('Ошибка запуска Telegram бота:', err);
		}

		this.bot.catch((err) => {
			console.error('Ошибка Telegram бота:', err);
		});
	}
}
