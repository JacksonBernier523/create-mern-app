const bodyParser 	= require('body-parser')
const express 		= require('express')
const cors 		    = require('cors')
const next          = require("next");
const dev           = process.env.NODE_ENV !== "production";
const nextApp       = next({ dev });
const handle        = nextApp.getRequestHandler();
require('./server/helpers')

nextApp.prepare().then(() => {

    const app 	= express();

    app.use(cors())
    app.use(bodyParser.json({limit: '10mb', extended: true}))
    app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, './server/views'));
    app.use(express.static(path.join(__dirname, './public')));

    fs.readdirSync(path.join(__dirname, `./server/routes`)).forEach(function(file) {
        if (file.match(/\.js$/) !== null && file !== 'index.js') {
            let name = file.replace('.js', '');
            app.use(require(`./server/routes/${name}`));
        }
    });

    app.get("*", (req, res) => {
        return handle(req, res);
    })

    let server = app.listen(process.env.PORT || process.env.APP_PORT, () => {
        console.log(" ");
        console.log('********** Server is running on port '+ server.address().port + ' **********')
        console.log(" ");
    }).on('error', (error) => {
        console.log(" ");
        console.log('********** \x1b[31mPort '+error.port+' is already in use\x1b[0m **********')
        console.log(" ");
    })
}).catch(ex => {
    console.error(ex.stack);
    process.exit(1);
});