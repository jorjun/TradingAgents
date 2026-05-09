<script lang="ts">
	import ConfigForm from '$lib/components/ConfigForm.svelte';
	import AgentPipeline from '$lib/components/AgentPipeline.svelte';
	import ResultPanel from '$lib/components/ResultPanel.svelte';
	import StatsPanel from '$lib/components/StatsPanel.svelte';
	import { config, result, isRunning, currentStep, resetPipeline } from '$lib/stores/pipeline';
	import { agents, resetAgents, updateAgentStatus } from '$lib/stores/agents';
	import type { AnalysisResult, TokenUsage } from '$lib/types';

	let tokenUsage = $state<TokenUsage | null>(null);
	let showConfig = $state(true);

	let agentNames: Record<string, string> = {
		'Market Analyst': 'Market Analyst',
		'Social Media Analyst': 'Social Media Analyst',
		'News Analyst': 'News Analyst',
		'Fundamentals Analyst': 'Fundamentals Analyst',
		'Research Debate': 'Bull Researcher',
		'Research Manager': 'Research Manager',
		'Trader': 'Trader',
		'Risk Debate': 'Aggressive Risk',
		'Portfolio Manager': 'Portfolio Manager'
	};

	async function runAnalysis() {
		resetAgents();
		resetPipeline();
		tokenUsage = null;
		$isRunning = true;
		$currentStep = 'Starting analysis...';
		showConfig = false;

		try {
			const cfg = $config;
			const startTime = Date.now();

			const response = await fetch('/api/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(cfg)
			});

			const data = await response.json();

			if (!data.success) {
				throw new Error(data.error || 'Analysis failed');
			}

			const s = data.state;
			const analysisResult: AnalysisResult = {
				ticker: s.ticker,
				date: s.date,
				decisions: s.portfolioDecision ? [s.portfolioDecision] : [],
				reports: [
					s.marketReport ? { role: 'analyst', name: 'Market Analyst', content: s.marketReport, timestamp: new Date().toISOString() } : null,
					s.sentimentReport ? { role: 'analyst', name: 'Social Media Analyst', content: s.sentimentReport, timestamp: new Date().toISOString() } : null,
					s.newsReport ? { role: 'analyst', name: 'News Analyst', content: s.newsReport, timestamp: new Date().toISOString() } : null,
					s.fundamentalsReport ? { role: 'analyst', name: 'Fundamentals Analyst', content: s.fundamentalsReport, timestamp: new Date().toISOString() } : null
				].filter(Boolean) as any,
				memory: [],
				duration: Date.now() - startTime,
				status: 'completed'
			};

			$result = analysisResult;
			tokenUsage = data.tokenUsage;

			if (data.steps) {
				data.steps.forEach((step: any) => {
					const agentName = agentNames[step.agent] || step.agent;
					if (agentName) {
						updateAgentStatus(
							agentName,
							step.status === 'running' ? 'running' : step.status === 'completed' ? 'completed' : 'failed',
							step.message
						);
					}
				});
			}

			$currentStep = 'Analysis complete';
		} catch (err) {
			$currentStep = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
		} finally {
			$isRunning = false;
		}
	}

	$effect(() => {
		if ($isRunning) {
			runAnalysis();
		}
	});
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
	<div class="lg:col-span-1 space-y-6">
		<div class="bg-gray-800 rounded-lg p-4">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400">Configuration</h2>
				<button
					onclick={() => (showConfig = !showConfig)}
					class="text-xs text-blue-400 hover:text-blue-300"
				>
					{showConfig ? 'Hide' : 'Show'}
				</button>
			</div>
			{#if showConfig}
				<ConfigForm />
			{/if}
		</div>

		<StatsPanel {tokenUsage} />

		{#if $currentStep}
			<div class="bg-gray-800 rounded-lg p-3">
				<p class="text-sm text-gray-400">{$currentStep}</p>
			</div>
		{/if}
	</div>

	<div class="lg:col-span-2 space-y-6">
		{#if $isRunning}
			<div class="bg-gray-800 rounded-lg p-4">
				<h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Agent Pipeline</h2>
				<AgentPipeline />
			</div>
		{/if}

		<div class="bg-gray-800 rounded-lg p-4">
			<h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Results</h2>
			<ResultPanel result={$result} />
		</div>
	</div>
</div>
