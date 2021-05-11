export function getLocalWhistleServer(port?: number) {
  return `127.0.0.1:${port || 8899}`;
}
