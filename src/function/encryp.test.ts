import {encrypt,decrypt} from './encrypt';

test('Encryting and Decryting', () => {
  const pwd = 'test';
  const encryptedPwd = encrypt(pwd);
  expect(decrypt(pwd, encryptedPwd)).toBe(true);
  expect(decrypt('tst', encryptedPwd)).toBe(false);
});
