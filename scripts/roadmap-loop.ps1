# Roadmap fixed loop: ticks 2-10 (iteration 1 runs at arm time)
for ($i = 2; $i -le 10; $i++) {
  Start-Sleep -Seconds 900
  $prompt = "Roadmap loop $i/10: read docs/roadmap-loop-plan.md row $i. Docs=ground truth. Sync code+docs, run npm run lint, npm test, npm run validate:openapi at repo root. Skip admin/auth UI. Log what changed."
  $json = @{ iteration = $i; prompt = $prompt } | ConvertTo-Json -Compress
  Write-Output "AGENT_LOOP_TICK_ROADMAP10 $json"
}
