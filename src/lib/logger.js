export function logError(context, error) {
  console.error(`[ERROR] [${context}]`, error);
}

export function logInfo(context, message) {
  console.log(`[INFO] [${context}] ${message}`);
}
