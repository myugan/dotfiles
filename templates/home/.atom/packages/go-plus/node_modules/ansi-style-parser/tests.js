var test = require('tape');
var chalk = require('chalk');
var parser = require('./');

var tst = function(t, src, expected){
  t.deepEquals(parser(src), expected);
};

test('basics', function(t){

  tst(t, 'hello world', [
      {styles: [], text: 'hello world'}
  ]);

  tst(t, chalk.green('hello'), [
      {styles: ['green'], text: 'hello'}
  ]);

  tst(t, 'hello ' + chalk.green('world') + chalk.red('!'), [
      {styles: [], text: 'hello '},
      {styles: ['green'], text: 'world'},
      {styles: ['red'], text: '!'}
  ]);

  tst(t, 'wat?\033[33m is\033[34m[34m\033[31m? \033[mend', [
      {styles: [], text: 'wat?'},
      {styles: ['yellow'], text: ' is'},
      {styles: ['blue'], text: '[34m'},
      {styles: ['red'], text: '? '},
      {styles: [], text: 'end'}
  ]);

  t.end();
});

test('nested_styles', function(t){
  tst(t, chalk.green.bgRed.underline('world'), [
      {styles: ['green', 'bgRed', 'underline'], text: 'world'}
  ]);

  tst(t, chalk.green('h'+chalk.bgRed('e'+chalk.bold('l'+chalk.blue('l') +chalk.underline('o')))+'!'), [
      {text: 'h', styles: ['green']},
      {text: 'e', styles: ['green', 'bgRed']},
      {text: 'l', styles: ['green', 'bgRed', 'bold']},
      {text: 'l', styles: ['bgRed', 'bold', 'blue']},
      {text: 'o', styles: ['bgRed', 'bold', 'green', 'underline']},
      {text: '!', styles: ['green']}
  ]);
  t.end();
});
