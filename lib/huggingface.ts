/**
 * Akash AI — Hugging Face Inference Client
 * Shared helper for all HF model calls with retry, timeout, and fallback
 */

const HF_API_URL = 'https://api-inference.huggingface.co/models';

interface HFOptions {
  parameters?: Record<string, any>;
  options?: { wait_for_model?: boolean; use_cache?: boolean };
  timeoutMs?: number;
  retries?: number;
}

interface HFTextResult {
  generated_text?: string;
  summary_text?: string;
  translation_text?: string;
  label?: string;
  score?: number;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function getApiKey(): string {
  const key = process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_TOKEN || '';
  if (!key || key.startsWith('hf_your') || key === 'your-api-key') {
    throw new Error('HUGGINGFACE_API_KEY not configured');
  }
  return key;
}

/** Text generation / inference (JSON in, JSON out) */
export async function hfTextInference(model: string, inputs: string, opts: HFOptions = {}): Promise<HFTextResult[]> {
  const apiKey = getApiKey();
  const { parameters = {}, options = { wait_for_model: true }, timeoutMs = 30000, retries = 1 } = opts;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(`${HF_API_URL}/${model}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, parameters, options }),
      }, timeoutMs);

      if (res.status === 503) {
        const body = await res.json().catch(() => ({}));
        const wait = body.estimated_time ? Math.min(body.estimated_time * 1000, 15000) : 5000;
        if (attempt < retries) { await new Promise(r => setTimeout(r, wait)); continue; }
        throw new Error(`Model ${model} is loading. Try again in ${Math.ceil(wait / 1000)}s.`);
      }
      if (!res.ok) { const e = await res.text().catch(() => ''); throw new Error(`HF error (${res.status}): ${e.slice(0, 200)}`); }
      const data = await res.json();
      return Array.isArray(data) ? data : [data];
    } catch (e: any) {
      if (e.name === 'AbortError') throw new Error('Request timeout (30s)');
      if (attempt >= retries) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('HF inference failed');
}

/** Image generation (JSON in, binary out) */
export async function hfImageGeneration(model: string, prompt: string, opts: HFOptions = {}): Promise<Buffer> {
  const apiKey = getApiKey();
  const { parameters = {}, timeoutMs = 45000, retries = 1 } = opts;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(`${HF_API_URL}/${model}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: prompt, parameters, options: { wait_for_model: true } }),
      }, timeoutMs);

      if (res.status === 503 && attempt < retries) { await new Promise(r => setTimeout(r, 8000)); continue; }
      if (!res.ok) { const e = await res.text().catch(() => ''); throw new Error(`Image gen failed (${res.status}): ${e.slice(0, 200)}`); }
      return Buffer.from(await res.arrayBuffer());
    } catch (e: any) {
      if (e.name === 'AbortError') throw new Error('Image generation timeout');
      if (attempt >= retries) throw e;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  throw new Error('Image generation failed');
}

/** Binary input inference (image/audio → result) */
export async function hfBinaryInference(model: string, fileBuffer: Buffer | ArrayBuffer, opts: HFOptions = {}): Promise<any> {
  const apiKey = getApiKey();
  const { timeoutMs = 30000, retries = 1 } = opts;
  const buffer = fileBuffer instanceof ArrayBuffer ? Buffer.from(fileBuffer) : fileBuffer;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(`${HF_API_URL}/${model}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: buffer,
      }, timeoutMs);

      if (res.status === 503 && attempt < retries) { await new Promise(r => setTimeout(r, 5000)); continue; }
      if (!res.ok) { const e = await res.text().catch(() => ''); throw new Error(`HF binary failed (${res.status}): ${e.slice(0, 200)}`); }

      const ct = res.headers.get('content-type') || '';
      if (ct.includes('image') || ct.includes('audio')) {
        return { type: 'binary', buffer: Buffer.from(await res.arrayBuffer()), contentType: ct };
      }
      return { type: 'json', data: await res.json() };
    } catch (e: any) {
      if (e.name === 'AbortError') throw new Error('Processing timeout');
      if (attempt >= retries) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('Binary inference failed');
}

/** Mistral/Mixtral chat helper */
export async function hfChat(prompt: string, opts: { systemPrompt?: string; maxTokens?: number; temperature?: number; model?: string } = {}): Promise<string> {
  const { systemPrompt = 'You are a helpful AI assistant. Respond in the same language as the user.', maxTokens = 1024, temperature = 0.7, model = MODELS.MIXTRAL } = opts;
  const input = `<s>[INST] ${systemPrompt}\n\n${prompt} [/INST]`;
  const results = await hfTextInference(model, input, { parameters: { max_new_tokens: maxTokens, temperature, return_full_text: false }, retries: 1 });
  return (results[0]?.generated_text || '').replace(/^\[\/INST\]\s*/g, '').replace(/<\/?s>/g, '').trim();
}

/** Try primary, then fallback */
export async function hfWithFallback<T>(primaryFn: () => Promise<T>, fallbackFn: () => Promise<T>, errMsg = 'Failed'): Promise<T> {
  try { return await primaryFn(); } catch { try { return await fallbackFn(); } catch { throw new Error(errMsg); } }
}

// Pre-configured model shortcuts
export const MODELS = {
  FLUX_SCHNELL: 'black-forest-labs/FLUX.1-schnell',
  SDXL: 'stabilityai/stable-diffusion-xl-base-1.0',
  SD_15: 'runwayml/stable-diffusion-v1-5',
  RMBG: 'briaai/RMBG-1.4',
  ANIME_GAN: 'akhaliq/AnimeGANv2',
  BART_SUMMARY: 'facebook/bart-large-cnn',
  T5_PARAPHRASE: 'humarin/chatgpt_paraphraser_on_T5_base',
  SENTIMENT: 'cardiffnlp/twitter-roberta-base-sentiment',
  KEYWORDS: 'ml6team/keyphrase-extraction-kbir-inspec',
  BANGLA_T5: 'csebuetnlp/banglat5_nmt_en_bn',
  WHISPER_LARGE: 'openai/whisper-large-v3',
  WHISPER_SMALL: 'openai/whisper-small',
  MMS_TTS: 'facebook/mms-tts-eng',
  STARCODER: 'bigcode/starcoder2-15b',
  CODE_LLAMA: 'codellama/CodeLlama-34b-Instruct-hf',
  MIXTRAL: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  MISTRAL: 'mistralai/Mistral-7B-Instruct-v0.2',
} as const;
