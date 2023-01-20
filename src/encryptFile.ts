import crypto from "crypto";


export const encrypt = (buffer, key) => {
    const algorithm = 'aes-256-ctr';

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return result;
};

export const decrypt = (encrypted, key) => {
    const algorithm = 'aes-256-ctr';

    const iv = encrypted.slice(0, 16);

    encrypted = encrypted.slice(16);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return result;
 };
