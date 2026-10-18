// Módulo bootstrap para carregar variáveis do .env antes da inicialização de conexões e modelos
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch {
    // Arquivo .env já carregado ou ausente
  }
}
