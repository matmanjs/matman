// const { util } = require('cmd-hub');
const { spawn } = require('child_process');

(async () => {
  // 执行命令
  // const child = await util.runCmd.runByExec('node ./exec-message-demo.js', {});

  const child = spawn('node', ['./exec-message-demo.js'], { stdio: [null, null, null, 'ipc'] });

  child.on('message', m => {
    console.log(m);
  });

  child.send('Here Here');
})();
