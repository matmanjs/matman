import { getSuccessData } from '../../base';

export default function getResult() {
  return getSuccessData({
    uid: 10,
    name: 'Delay-0',
    age: 2000
  });
}