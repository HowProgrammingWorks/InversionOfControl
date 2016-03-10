require('../framework.js').load();

Api( {
    name: './task.js',
    imports: {
        console: console
    },
    options: {
        debugContextChanges: true,
    }
});

Main( './task.js' );

configure();


