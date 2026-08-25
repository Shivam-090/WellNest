/**
 * Ollama Connection & Base Client Service
 * Manages connection, health checks, and base API requests to local Ollama instance
 */

export const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'maxwell1500/psycho:12b';

/**
 * Check if Ollama server is running locally and if maxwell1500/psycho:12b is available
 */
export const checkOllamaStatus = async () => {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) {
      return { online: false, modelFound: false, error: `Ollama returned status ${res.status}` };
    }

    const data = await res.json();
    const models = data.models || [];
    const targetModel = models.find(
      (m) => m.name === OLLAMA_MODEL || m.model === OLLAMA_MODEL || m.name.includes('psycho')
    );

    return {
      online: true,
      model: OLLAMA_MODEL,
      modelFound: !!targetModel,
      availableModels: models.map((m) => m.name)
    };
  } catch (error) {
    return {
      online: false,
      model: OLLAMA_MODEL,
      modelFound: false,
      error: error.message
    };
  }
};

/**
 * Low-level chat runner with Ollama API
 */
export const callOllamaChatRaw = async ({ messages, options = {} }) => {
  const startTime = Date.now();
  console.log(`\n🧠 [Ollama Request] Sending chat to local ${OLLAMA_MODEL}...`);

  const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: {
        temperature: options.temperature ?? 0.7,
        top_p: options.top_p ?? 0.9,
        num_predict: options.num_predict ?? 350,
        num_ctx: options.num_ctx ?? 2048,
        ...options
      }
    }),
    signal: AbortSignal.timeout(180000) // 3-minute timeout for local 12B model
  });

  if (!res.ok) {
    throw new Error(`Ollama HTTP error ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ [Ollama Response] Received from ${OLLAMA_MODEL} in ${elapsed}s (${data.eval_count || '?'} tokens)\n`);

  return data;
};

/**
 * Low-level generate runner with Ollama API
 */
export const callOllamaGenerateRaw = async ({ prompt, format, options = {} }) => {
  const startTime = Date.now();
  console.log(`\n🧠 [Ollama Assessment] Running evaluation with local ${OLLAMA_MODEL}...`);

  const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      format: format || 'json',
      stream: false,
      options: {
        temperature: options.temperature ?? 0.3,
        num_predict: options.num_predict ?? 650,
        num_ctx: options.num_ctx ?? 2048,
        ...options
      }
    }),
    signal: AbortSignal.timeout(180000) // 3-minute timeout
  });

  if (!res.ok) {
    throw new Error(`Ollama HTTP error ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ [Ollama Assessment Done] Completed in ${elapsed}s (${data.eval_count || '?'} tokens)\n`);

  return data;
};
