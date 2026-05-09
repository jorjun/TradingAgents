import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { AnalysisConfig } from '$lib/types';
import { TradingGraphRunner, type StepResult } from '$lib/graph/trading-graph';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const config: AnalysisConfig = await request.json();

		if (!config.ticker) {
			return json({ error: 'Ticker symbol is required' }, { status: 400 });
		}

		const runner = new TradingGraphRunner(config);
		await runner.initialize();

		const steps: StepResult[] = [];
		const result = await runner.run((step) => {
			steps.push(step);
		});

		return json({
			success: true,
			decision: result.decision,
			state: {
				ticker: result.state.ticker,
				date: result.state.date,
				marketReport: result.state.marketReport,
				sentimentReport: result.state.sentimentReport,
				newsReport: result.state.newsReport,
				fundamentalsReport: result.state.fundamentalsReport,
				researchPlan: result.state.researchPlan,
				traderProposal: result.state.traderProposal,
				portfolioDecision: result.state.portfolioDecision,
				debateHistory: result.state.debateHistory,
				riskDebateHistory: result.state.riskDebateHistory
			},
			tokenUsage: result.tokenUsage,
			steps
		});
	} catch (error) {
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Analysis failed'
			},
			{ status: 500 }
		);
	}
};
