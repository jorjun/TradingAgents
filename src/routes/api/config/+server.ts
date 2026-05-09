import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
	return json({
		providers: {
			openai: !!env.OPENAI_API_KEY,
			anthropic: !!env.ANTHROPIC_API_KEY,
			google: !!env.GOOGLE_API_KEY,
			deepseek: !!env.DEEPSEEK_API_KEY,
			xai: !!env.XAI_API_KEY
		},
		models: {
			quick: [
				{ label: 'GPT-4o Mini', value: 'gpt-4o-mini', provider: 'openai' },
				{ label: 'Claude 3.5 Haiku', value: 'claude-3-5-haiku-20241022', provider: 'anthropic' },
				{ label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash', provider: 'google' },
				{ label: 'DeepSeek V3', value: 'deepseek-chat', provider: 'deepseek' },
				{ label: 'Grok 2', value: 'grok-2-1212', provider: 'xai' }
			],
			deep: [
				{ label: 'GPT-4o', value: 'gpt-4o', provider: 'openai' },
				{ label: 'Claude Sonnet 4', value: 'claude-sonnet-4-20250514', provider: 'anthropic' },
				{ label: 'Claude Opus 4', value: 'claude-opus-4-20250514', provider: 'anthropic' },
				{ label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro-preview-03-25', provider: 'google' },
				{ label: 'DeepSeek R1', value: 'deepseek-reasoner', provider: 'deepseek' }
			]
		}
	});
};
