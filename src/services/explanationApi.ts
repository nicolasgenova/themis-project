import type { SelectedItem } from '../components/dicionario/dicionario'

export async function requestAiExplanation(item: SelectedItem, signal?: AbortSignal, question?: string) {
  if (!item.apiContext) throw new Error('Este item não possui contexto para a IA.')
  const response = await fetch('/api/explicar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: item.title, value: item.value, context: item.apiContext, question }),
    signal,
  })
  const data = await response.json().catch(() => ({})) as { explicacao?: string; erro?: string }
  if (!response.ok || !data.explicacao) throw new Error(data.erro || 'Não foi possível obter a explicação.')
  return data.explicacao
}
