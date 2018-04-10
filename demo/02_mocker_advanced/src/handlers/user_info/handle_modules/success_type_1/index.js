import { getSuccessData } from '../../base';

export default function getResult() {
  return getSuccessData({
    uid: 11,
    name: 'Lucy-1',
    age: 18,
    description: 'School Girl'
  });
}