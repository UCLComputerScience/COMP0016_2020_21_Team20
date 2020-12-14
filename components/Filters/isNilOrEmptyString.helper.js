import * as R from 'ramda';

export default function isNilOrEmptyString(value) {
  return R.isNil(value) || value === '';
}
