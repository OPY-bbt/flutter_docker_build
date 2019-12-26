var Koa = require('koa');
var KoaBody = require('koa-body');
var Route = require('koa-route');
var KoaStatic = require('koa-static');
var Fs = require('fs');
var Path = require('path');
var exec = require('child_process').exec;

var app = new Koa();

app.use(KoaBody());
app.use(KoaStatic(Path.join(__dirname)));
app.use(Route.get('/', main));
app.use(Route.post('/build', build));

app.listen(3000);

function main(ctx) {
    ctx.type = 'html';
    ctx.body = Fs.createReadStream('./html/index.html');
}

function build(ctx) {
    ctx.type = 'json';
    ctx.body = JSON.stringify({ stat: 1 });

    var request_body = ctx.request.body;
    var version = request_body.version;
    var channels = request_body.channels;

    Fs.writeFile(
        Path.join(__dirname, '../ips_app/android/app/channel.json'),
        JSON.stringify({channelInfoList: channels}),
        'utf8',
        function(error) {
            if (!error) {
                console.log('write channel file success');
                exec('../ips_app/deploy.sh ' + version, function(error, stdout, stderr) {
                    if (error) {
                        console.log('error:', error);
                    }
                    console.log(stdout);
                });
            }
        },
    );
}