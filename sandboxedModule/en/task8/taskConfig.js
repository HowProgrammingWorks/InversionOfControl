require('../framework').load();

Api( {
    name: './task.js',
    imports: { console: console },
    options: { debugSource: true }
});

Main( './task.js' );

configure();
