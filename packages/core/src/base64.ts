/**
 * Base 64 encoder/decoder
 */
 export default class Base64 {
    private PADCHAR: string = "=";
    private ALPHA: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /**
     * Takes in a previously encoded string and returns the decoded result
     *
     * ~~~
     * const B64 = new Base64();
     * let coded = B64.encode("abc123"); // "YWJjMTIz"
     * let decoded = B64.decode(coded); // "abc123"
     * ~~~
     * @param s
     * @returns {string}
     */
    public decode(s: string): string {
        let pads: number = 0;
        let i;
        let b10;
        let imax: number = s ? s.length : 0;
        const x: string[] = [];

        s = String(s);

        if (imax === 0) {
            return s;
        }

        if (s.charAt(imax - 1) === this.PADCHAR) {
            pads = 1;
            if (s.charAt(imax - 2) === this.PADCHAR) {
                pads = 2;
            }
            imax -= 4;
        }

        for (i = 0; i < imax; i += 4) {
            b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) | (this.getByte64(s, i + 2) << 6) | this.getByte64(s, i + 3);
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255, b10 & 255));
        }

        switch (pads) {
            case 1:
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) | (this.getByte64(s, i + 2) << 6);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255));
                break;
            case 2:
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12);
                x.push(String.fromCharCode(b10 >> 16));
                break;
        }

        return x.join("");
    }

    /**
     * Encodes a string using Base 64 encoding
     *
     * ~~~
     * const B64 = new Base64();
     * let coded = B64.encode("abc123"); // "YWJjMTIz"
     * ~~~
     * @param s
     * @returns {string}
     */
    public encode(s: string): string {
        let i;
        let b10;
        const x: string[] = [];
        const imax: number = s ? s.length - s.length % 3 : 0;

        if (s.length === 0) {
            return s;
        }

        for (i = 0; i < imax; i += 3) {
            b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8) | this.getByte(s, i + 2);
            x.push(this.ALPHA.charAt(b10 >> 18));
            x.push(this.ALPHA.charAt((b10 >> 12) & 63));
            x.push(this.ALPHA.charAt((b10 >> 6) & 63));
            x.push(this.ALPHA.charAt(b10 & 63));
        }

        switch (s.length - imax) {
            case 1:
                b10 = this.getByte(s, i) << 16;
                x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) + this.PADCHAR + this.PADCHAR);
                break;
            case 2:
                b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8);
                x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) + this.ALPHA.charAt((b10 >> 6) & 63) + this.PADCHAR);
                break;
        }

        return x.join("");
    }

    private getByte(s: string, i: number): number {
        const x = s.charCodeAt(i);
        return x;
    }

    private getByte64(s: string, i: number): number {
        const idx = this.ALPHA.indexOf(s.charAt(i));
        return idx;
    }
}