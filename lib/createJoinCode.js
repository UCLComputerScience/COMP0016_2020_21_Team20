import { customAlphabet } from 'nanoid';

const CODE_LENGTH = 9;
const CODE_DELIMITER_LENGTH = CODE_LENGTH / 3;
const CODE_ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const CODE_DELIMITER_REGEX = new RegExp(`.{1,${CODE_DELIMITER_LENGTH}}`, 'g');

const nanoid = customAlphabet(CODE_ALPHABET, CODE_LENGTH);

const createJoinCode = async () => {
  const code = await nanoid(CODE_ALPHABET, CODE_LENGTH);
  return code.match(CODE_DELIMITER_REGEX).join('-');
};

export default createJoinCode;
