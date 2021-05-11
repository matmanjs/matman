console.log('---111---');

process.on('message', m => {
  process.send(`< ${m}`);
  process.send('> 不要回答x3');
});
