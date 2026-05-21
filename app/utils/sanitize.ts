const INJECTION_PATTERNS = [
  /ignora\s+(todas\s+)?(tus\s+)?instrucciones/i,
  /olvida\s+(todo|tus\s+instrucciones)/i,
  /act[uú]a\s+como/i,
  /eres\s+ahora/i,
  /\[SYSTEM\]/i,
  /sin\s+restricciones/i,
  /jailbreak/i,
];

export function detectInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((p) => p.test(input));
}
