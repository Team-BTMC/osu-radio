// Template follows tokenizer-parser architecture
// String is converted to tokens and parser validates grammar of token sequence. From this sequence a
// "list of instructions" is created. Using the "list of instructions" together with data source will produce a dynamic
// string templating. Similar architecture is used to interpret search queries

export const Tokens = {
  Illegal: "ILLEGAL",
  EOF: "EOF",
  LeftSquirly: "{",
  RightSquirly: "}",
  Text: "TEXT",
} as const;

type TokenItem = (typeof Tokens)[keyof typeof Tokens];

export type Token = {
  type: TokenItem;
  literal: string;
  position: number;
};

function createToken(type: TokenItem, literal: string, position: number): Token {
  return { type, literal, position };
}

export class TemplateTokenizer {
  private position = 0;
  private readPosition = 0;
  private char = "\0";
  private input = "";

  private readChar() {
    if (this.readPosition >= this.input.length) {
      this.char = "\0";
    } else {
      this.char = this.input[this.readPosition];
    }

    this.position = this.readPosition;
    this.readPosition++;
  }

  private peek(offset = 0): string {
    const pos = this.readPosition + offset;
    return pos < this.input.length ? this.input[pos] : "\0";
  }

  nextToken() {
    this.readChar();

    switch (this.char) {
      case "\0":
        return createToken(Tokens.EOF, this.char, this.position);
      case "\\":
        const next = this.peek();
        if (next === "{" || next === "}") {
          this.readChar();
          return createToken(Tokens.Text, this.char, this.position);
        }

        return createToken(Tokens.Text, this.char, this.position);
      case "{":
        return createToken(Tokens.LeftSquirly, this.char, this.position);
      case "}":
        return createToken(Tokens.RightSquirly, this.char, this.position);
      default:
        return createToken(Tokens.Text, this.char, this.position);
    }
  }

  tokenize(input: string): Token[] {
    this.input = input;
    const tokens: Token[] = [];

    while (true) {
      const token = this.nextToken();

      const doConcatTextTokens =
        tokens[tokens.length - 1]?.type === Tokens.Text && token.type === Tokens.Text;
      if (doConcatTextTokens) {
        tokens[tokens.length - 1].literal += token.literal;
        continue;
      }

      if (token.type === Tokens.EOF) {
        break;
      }

      tokens.push(token);
    }

    return tokens;
  }
}
