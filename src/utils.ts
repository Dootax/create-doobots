import type { WriteStream } from 'tty';

export function clearLine(stream: WriteStream): void {
    if (stream.isTTY) {
        stream.write('\u001B[999D\u001B[K');
    }
}