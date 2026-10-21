/**
 * Ollama Service Barrel & Dispatcher
 * Exports modular services for connection, chat, and check-in assessments
 */

export { 
  OLLAMA_BASE_URL, 
  OLLAMA_MODEL, 
  checkOllamaStatus, 
  callOllamaChatRaw, 
  callOllamaGenerateRaw 
} from './ollama/ollamaConnection.js';

export { generateOllamaChat } from './ollama/ollamaChatService.js';
export { analyzeCheckInWithOllama } from './ollama/ollamaCheckInService.js';
