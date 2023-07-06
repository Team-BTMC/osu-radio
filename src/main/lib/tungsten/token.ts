import { flatRNG } from './math';



const TOKEN_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const TOKEN_CHARSET_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export type Token = string;


const globalTokens: Set<Token> = new Set();

export function generateToken(forceFirstLetter = false, length = 8, set: Set<string> = undefined as any): Token {
  let id = "";
  const MAX_RETRIES = 10_000;
  let retry = 0;

  if (forceFirstLetter === true) {
    id = TOKEN_CHARSET_ALPHA[flatRNG(0, TOKEN_CHARSET_ALPHA.length)];
    length--;
  }

  do {
    for (let i = 0; i < length - 1; i++) {
      id += TOKEN_CHARSET[flatRNG(0, TOKEN_CHARSET.length)];
    }

    if (++retry === MAX_RETRIES) break;
  } while ((set ?? globalTokens).has(id));

  if (retry === MAX_RETRIES) {
    return generateToken(forceFirstLetter, length + 1, set);
  }

  (set ?? globalTokens).add(id);
  return id;
}

export function freeToken(token: Token, set: Set<Token> = undefined as any): void {
  (set ?? globalTokens).delete(token);
}



export class TokenNamespace {
  private readonly set: Set<Token>;

  constructor() {
    this.set = new Set();
  }

  create(forceFirstLetter = false, length = 8): Token {
    return generateToken(forceFirstLetter, length, this.set);
  }

  destroy(token: Token): void {
    freeToken(token, this.set);
  }
}