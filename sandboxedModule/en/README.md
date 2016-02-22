## Description

`framework.js` - small piece of the framework, just to demonstrate IoC
`application.js` - small piece of the application, also for IoC demonstration

## How to execute

From the command line, type: `node ./framework.js` or `node framework`

## Tasks

You may select at least one of the following tasks, make a fork of this
repository and implement your solution there. If those tasks are simple
for somebody, please see additional tasks below.

1. Add `setTimeout` and `setInterval` to the application context and use them
printing something from the timer function using console.log()

2. Inject a link to `util` library into the application context and make a few
calls to its functions from applied code

3. Implement the ability to run different applications inside framework, using
command line option, e.g.: `node framework <applicationName>`

4. Wrap or intercept `console.log()` call to add more info into console output
in the following format: `<applicationName> <time> <message>`

5. Wrap or intercept `console.log()` in the sandboxed application logging all
console output into a file in the format: `<applicationName> <time> <message>`

6. Give a link to `require` function to the application, add call to it and
wrap it for logging to a file in the format: `<time> <module name>` 

7. Export a hash from `application.js` with multiple functions and variables,
print the list with types from framework

8. Export a function from `application.js` and print a list of its parameters
form the framework (you can start printing function source)

9. Print a list of everything from the application global context (application
sandbox) with the data types specified

10. Compare an application sandboxed context keys before application loaded and
after, print it from the framework and find a difference (keys added / deleted)

## Additional tasks

11. You can combine several tasks (listed above) in your code, implement a more
complex example of interaction between framework and application, preparing
run-time environment (sandbox) and/or improving CLI (command line interface)

12. Implement a similar example in another programming language

13. Improve and/or optimize Impress Application Server code, specifically
everything related to sandboxing, see:
[/lib/impress.application.js](https://github.com/tshemsedinov/impress/blob/master/lib/impress.application.js)

14. Use IoC and code isolation principles using sandboxed context and/or other
similar technique in your projects (any technological stack) to demonstrate its
use and the effect of such use
