import { Injectable } from '@nestjs/common';

@Injectable()
export class encodeAndDecode {
  encryptedToken(token: string) {
    const stringArray = token.split('').reverse();
    return stringArray;
  }

  decryptedToken(token: Array<string>) {
    const originalString = token.join('').split('').reverse().join('');
    return originalString;
  }
}
