var ejs = require('ejs');

function getCgiResult(tpl, data) {
    return ejs.render(tpl, data);
}

var json = {
    name: 'return-plain-object',
    age: 16
};

var tpl = {
    retcode: 0,
    result: '<%=JSON.stringify(data)%>'
};

// var result = getCgiResult(tpl, json);
var result = JSON.stringify(tpl);
result = getCgiResult(result, {data:json});


console.log(result,typeof result);

// module.exports = json;exports