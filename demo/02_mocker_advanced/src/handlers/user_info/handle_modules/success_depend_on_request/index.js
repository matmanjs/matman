import { getSuccessData } from '../../base';
import successType0 from '../success_type_0';
import successType1 from '../success_type_1';

export default function getResult(params, req) {
  let data = (params.type === '0') ? successType0() : successType1();

  return getSuccessData(Object.assign({}, data.result, {
    uid: params.uid
  }));
}