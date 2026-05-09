<script lang="ts">
	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-900 text-gray-100">
	<header class="border-b border-gray-800 bg-gray-950">
		<div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<h1 class="text-xl font-bold text-white">TradingAgents</h1>
				<span class="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">Multi-Agent Trading Framework</span>
			</div>
			<div class="flex items-center gap-4 text-xs text-gray-500">
				<a href="https://github.com/TauricResearch/TradingAgents" target="_blank" class="hover:text-gray-300 transition-colors">
					GitHub
				</a>
				<a href="https://arxiv.org/abs/2412.20138" target="_blank" class="hover:text-gray-300 transition-colors">
					Paper
				</a>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 py-6">
		{@render children()}
	</main>
</div>
