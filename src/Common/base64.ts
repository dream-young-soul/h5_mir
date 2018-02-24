// For the base64 encoding pieces.
class Base64
{
  public alphabet = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
      'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
      'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
      'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
      'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
      'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
      'w', 'x', 'y', 'z', '0', '1', '2', '3',
      '4', '5', '6', '7', '8', '9', '+', '/'
  ];
  public  values = {};
  constructor()
  {
    
    for (let i = 0; i < 64; ++i) 
    {
      this.values[this.alphabet[i]] = i;
    }
  }


   public encode(bytes: ArrayBuffer): string {
    const array = new Uint8Array(bytes);
    const base64 = [];
    let index = 0;
    let quantum;
    let value;
    /* tslint:disable:no-bitwise */
    // Grab as many sets of 3 bytes as we can, that form 24 bits.
    while (index + 2 < array.byteLength) {
      quantum = (array[index] << 16) | (array[index + 1] << 8) | array[index + 2];
      // 24 bits will become 4 base64 chars.
      value = (quantum >> 18) & 0x3f;
      base64.push(this.alphabet[value]);
      value = (quantum >> 12) & 0x3f;
      base64.push(this.alphabet[value]);
      value = (quantum >> 6) & 0x3f;
      base64.push(this.alphabet[value]);
      value = quantum & 0x3f;
      base64.push(this.alphabet[value]);
      index += 3;
    }
    // At this point, there are 0, 1 or 2 bytes left.
    if (index + 1 === array.byteLength) {
      // 8 bits; shift by 4 to pad on the right with 0s to make 12 bits total.
      quantum = array[index] << 4;
      value = (quantum >> 6) & 0x3f;
      base64.push(this.alphabet[value]);
      value = quantum & 0x3f;
      base64.push(this.alphabet[value]);
      base64.push('==');
    } else if (index + 2 === array.byteLength) {
      // 16 bits; shift by 2 to pad on the right with 0s to make 18 bits total.
      quantum = (array[index] << 10) | (array[index + 1] << 2);
      value = (quantum >> 12) & 0x3f;
      base64.push(this.alphabet[value]);
      value = (quantum >> 6) & 0x3f;
      base64.push(this.alphabet[value]);
      value = quantum & 0x3f;
      base64.push(this.alphabet[value]);
      base64.push('=');
    }
    /* tslint:enable:no-bitwise */
    return base64.join('');
  }

  public decode(string: string): Uint8Array {
    let size = string.length;
    if (size === 0) {
      return new Uint8Array(new ArrayBuffer(0));
    }
    if (size % 4 !== 0) {
      throw new Error('Bad length: ' + size);
    }
    if (!string.match(/^[a-zA-Z0-9+/]+={0,2}$/)) {
      throw new Error('Invalid base64 encoded value');
    }
    // Every 4 base64 chars = 24 bits = 3 bytes. But, we also need to figure out
    // padding, if any.
    let bytes = 3 * (size / 4);
    let numPad = 0;
    if (string.charAt(size - 1) === '=') {
      numPad++;
      bytes--;
    }
    if (string.charAt(size - 2) === '=') {
      numPad++;
      bytes--;
    }
    const buffer = new Uint8Array(new ArrayBuffer(bytes));
    let index = 0;
    let bufferIndex = 0;
    let quantum;
    if (numPad > 0) {
      size -= 4; // handle the last one specially
    }
    /* tslint:disable:no-bitwise */
    while (index < size) {
      quantum = 0;
      for (let i = 0; i < 4; ++i) {
        quantum = (quantum << 6) | this.values[string.charAt(index + i)];
      }
      // quantum is now a 24-bit value.
      buffer[bufferIndex++] = (quantum >> 16) & 0xff;
      buffer[bufferIndex++] = (quantum >> 8) & 0xff;
      buffer[bufferIndex++] = quantum & 0xff;
      index += 4;
    }
    if (numPad > 0) {
      // if numPad == 1, there is one =, and we have 18 bits with 2 0s at end.
      // if numPad == 2, there is two ==, and we have 12 bits with 4 0s at end.
      // First, grab my quantum.
      quantum = 0;
      for (let i = 0; i < 4 - numPad; ++i) {
        quantum = (quantum << 6) | this.values[string.charAt(index + i)];
      }
      if (numPad === 1) {
        // quantum is 18 bits, but really represents two bytes.
        quantum = quantum >> 2;
        buffer[bufferIndex++] = (quantum >> 8) & 0xff;
        buffer[bufferIndex++] = quantum & 0xff;
      } else {
        // quantum is 12 bits, but really represents only one byte.
        quantum = quantum >> 4;
        buffer[bufferIndex++] = quantum & 0xff;
      }
    }
    /* tslint:enable:no-bitwise */
    return buffer;
  }

}
