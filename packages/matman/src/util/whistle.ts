import {exec} from 'child_process';

export function checkIfWhistleStarted(): Promise<string | number> {
  return new Promise((resolve, reject) => {
    exec('w2 status', function (error, stdout, stderr) {
      if (error) {
        return reject(error);
      }

      const matchResult = stdout.match(/127\.0\.0\.1:([0-9]+)\//i);
      if (matchResult && matchResult[1]) {
        resolve(matchResult[1]);
      } else {
        reject(stdout);
      }
    });
  });
}

export function startWhistleDirect(): Promise<string | number> {
  return new Promise((resolve, reject) => {
    exec('w2 start', function (error, stdout, stderr) {
      if (error) {
        return reject(error);
      }

      const matchResult = stdout.match(/127\.0\.0\.1:([0-9]+)\//i);
      if (matchResult && matchResult[1]) {
        resolve(matchResult[1]);
      } else {
        reject(stdout);
      }
    });
  });
}
