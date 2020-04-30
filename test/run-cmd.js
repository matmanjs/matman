const { spawn, exec } = require('child_process');

function runBySpawn(command, args, options, customCloseHandler) {
    console.log('[runBySpawn] command, args, options', command, args, options);

    return new Promise((resolve, reject) => {
        // https://nodejs.org/dist/latest-v10.x/docs/api/child_process.html#child_process_child_process_spawn_command_args_options
        const cmd = spawn(command, args, {
            ...options,

            // https://git.code.oa.com/matmanjs/discussion-and-brainstorming/issues/62
            shell: true
        });

        cmd.stdout.on('data', (data) => {
            console.log(`${data}`);

            // 在某些场景下不会触发 close 事件，会导致进程不退出，例如启动了 watch 的项目
            // 因此自定义一个回调，自行判断哪些场景下可以认为执行结束了
            if (typeof customCloseHandler === 'function') {
                Promise.resolve(customCloseHandler(data))
                    .then((result) => {
                        if (result) {
                            console.log('-------customCloseHandler close-------');

                            // 自行退出子进程，但是有些场景下不能调用它，例如webpack开发模式下启动 8002 端口那种场景
                            // cmd.kill('SIGINT');

                            resolve(cmd);
                        }
                    });
            }
        });

        cmd.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        cmd.on('close', (code) => {
            console.log(`child process exited with code ${code} for ${command} ${args}`);
            resolve(cmd);
        });
    });
}

function runByExec(command, options, customCloseHandler) {
    console.log('[runByExec] command, options', command, options);

    return new Promise((resolve, reject) => {
        // https://nodejs.org/dist/latest-v10.x/docs/api/child_process.html#child_process_child_process_exec_command_options_callback
        const cmd = exec(command, options, function (err, stdout, stderr) {
            // 此回调触发时，同时也会触发 close 事件

            // 有些情况下err为null，但是存在 stderr ，也意味着出现错误
            // 因为jest每行都打印在stderr上，所以去掉对这个的判定
            // if (err || stderr) {
            //     reject(stderr);
            //     return;
            // }

            resolve(cmd);
        });

        cmd.stdout.on('data', (data) => {
            console.log(`${data}`);

            // 在某些场景下不会触发 close 事件，会导致进程不退出，例如启动了 watch 的项目
            // 因此自定义一个回调，自行判断哪些场景下可以认为执行结束了
            if (typeof customCloseHandler === 'function') {
                Promise.resolve(customCloseHandler(data))
                    .then((result) => {
                        if (result) {
                            console.log('-------customCloseHandler close-------');

                            // 自行退出子进程，但是有些场景下不能调用它，例如webpack开发模式下启动 8002 端口那种场景
                            // cmd.kill('SIGINT');

                            resolve(cmd);
                        }
                    });
            }
        });

        cmd.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        // 当进程退出时，会触发 close 事件，同时，callback 回调也会触发，
        // 因此此处可以不必监听处理，在 callback 中处理即可
        // cmd.on('close', (code) => {
        //     console.log(`=====child process exited with code ${code}`);
        //     resolve(code);
        // });
    });
}

module.exports = {
    runBySpawn,
    runByExec
};