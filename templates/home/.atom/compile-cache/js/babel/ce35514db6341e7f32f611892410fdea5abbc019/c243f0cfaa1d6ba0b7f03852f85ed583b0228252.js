var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/* eslint-env jasmine */

var _libAutocompleteSuggestions = require('../../lib/autocomplete/suggestions');

var Suggestions = _interopRequireWildcard(_libAutocompleteSuggestions);

'use babel';

describe('gocodeprovider-suggestions', function () {
  describe('matchFunc', function () {
    var t = function t(context) {
      var match = Suggestions.matchFunc(context.input);
      expect(match).toBeTruthy();
      expect(match.length).toBe(3);
      expect(match[0]).toBe(context.input);
      expect(match[1]).toBe(context.args);
      expect(match[2]).toBe(context.returns);
    };

    it('identifies function arguments', function () {
      t({
        input: 'func(name string, flag bool) bool',
        args: 'name string, flag bool',
        returns: 'bool'
      });
      t({
        input: 'func(name string, flag bool) (bool)',
        args: 'name string, flag bool',
        returns: 'bool'
      });
      t({
        input: 'func(name string, f func(t *testing.T)) bool',
        args: 'name string, f func(t *testing.T)',
        returns: 'bool'
      });
      t({
        input: 'func(name string, f func(t *testing.T)) (bool)',
        args: 'name string, f func(t *testing.T)',
        returns: 'bool'
      });
      t({
        input: 'func(name string, f func(t *testing.T) int) (bool)',
        args: 'name string, f func(t *testing.T) int',
        returns: 'bool'
      });
      t({
        input: 'func(pattern string, handler func(http.ResponseWriter, *http.Request))',
        args: 'pattern string, handler func(http.ResponseWriter, *http.Request)',
        returns: undefined
      });
      t({
        input: 'func(n int) func(p *T)',
        args: 'n int',
        returns: 'func(p *T)'
      });
    });
  });

  describe('parseType', function () {
    var t = function t(context) {
      var result = Suggestions.parseType(context.input);
      expect(result).toBeTruthy();
      expect(result.isFunc).toBeTruthy();
      expect(result.args).toEqual(context.args);
      expect(result.returns).toEqual(context.returns);
    };

    it('parses the function into args and returns arrays', function () {
      t({
        input: 'func(name string, flag bool) bool',
        args: [{
          name: 'name string',
          identifier: 'name',
          type: { name: 'string', isFunc: false }
        }, {
          name: 'flag bool',
          identifier: 'flag',
          type: { name: 'bool', isFunc: false }
        }],
        returns: [{
          name: 'bool',
          identifier: '',
          type: { name: 'bool', isFunc: false }
        }]
      });

      t({
        input: 'func(name string, flag bool) (bool)',
        args: [{
          name: 'name string',
          identifier: 'name',
          type: { name: 'string', isFunc: false }
        }, {
          name: 'flag bool',
          identifier: 'flag',
          type: { name: 'bool', isFunc: false }
        }],
        returns: [{
          name: 'bool',
          identifier: '',
          type: { name: 'bool', isFunc: false }
        }]
      });

      t({
        input: 'func(name string, f func(t *testing.T)) bool',
        args: [{
          name: 'name string',
          identifier: 'name',
          type: { name: 'string', isFunc: false }
        }, {
          name: 'f func(t *testing.T)',
          identifier: 'f',
          type: {
            isFunc: true,
            name: 'func(t *testing.T)',
            args: [{
              name: 't *testing.T',
              identifier: 't',
              type: { name: '*testing.T', isFunc: false }
            }],
            returns: []
          }
        }],
        returns: [{
          name: 'bool',
          identifier: '',
          type: { name: 'bool', isFunc: false }
        }]
      });

      t({
        input: 'func(name string, f func(t *testing.T)) (bool)',
        args: [{
          name: 'name string',
          identifier: 'name',
          type: { name: 'string', isFunc: false }
        }, {
          name: 'f func(t *testing.T)',
          identifier: 'f',
          type: {
            isFunc: true,
            name: 'func(t *testing.T)',
            args: [{
              name: 't *testing.T',
              identifier: 't',
              type: { name: '*testing.T', isFunc: false }
            }],
            returns: []
          }
        }],
        returns: [{
          name: 'bool',
          identifier: '',
          type: { name: 'bool', isFunc: false }
        }]
      });

      t({
        input: 'func(pattern string, handler func(http.ResponseWriter, *http.Request))',
        args: [{
          name: 'pattern string',
          identifier: 'pattern',
          type: { name: 'string', isFunc: false }
        }, {
          name: 'handler func(http.ResponseWriter, *http.Request)',
          identifier: 'handler',
          type: {
            isFunc: true,
            name: 'func(http.ResponseWriter, *http.Request)',
            args: [{
              name: 'http.ResponseWriter',
              identifier: '',
              type: { name: 'http.ResponseWriter', isFunc: false }
            }, {
              name: '*http.Request',
              identifier: '',
              type: { name: '*http.Request', isFunc: false }
            }],
            returns: []
          }
        }],
        returns: []
      });

      t({
        input: 'func(pattern string, handler func(http.ResponseWriter, *http.Request), otherhandler func(http.ResponseWriter, *http.Request))',
        args: [{
          name: 'pattern string',
          identifier: 'pattern',
          type: { name: 'string', isFunc: false }
        }, {
          name: 'handler func(http.ResponseWriter, *http.Request)',
          identifier: 'handler',
          type: {
            isFunc: true,
            name: 'func(http.ResponseWriter, *http.Request)',
            args: [{
              name: 'http.ResponseWriter',
              identifier: '',
              type: { name: 'http.ResponseWriter', isFunc: false }
            }, {
              name: '*http.Request',
              identifier: '',
              type: { name: '*http.Request', isFunc: false }
            }],
            returns: []
          }
        }, {
          name: 'otherhandler func(http.ResponseWriter, *http.Request)',
          identifier: 'otherhandler',
          type: {
            isFunc: true,
            name: 'func(http.ResponseWriter, *http.Request)',
            args: [{
              name: 'http.ResponseWriter',
              identifier: '',
              type: { name: 'http.ResponseWriter', isFunc: false }
            }, {
              name: '*http.Request',
              identifier: '',
              type: { name: '*http.Request', isFunc: false }
            }],
            returns: []
          }
        }],
        returns: []
      });

      t({
        input: 'func(pattern string, handler func(w http.ResponseWriter, r *http.Request), otherhandler func(w http.ResponseWriter, r *http.Request))',
        args: [{
          name: 'pattern string',
          identifier: 'pattern',
          type: { name: 'string', isFunc: false }
        }, {
          name: 'handler func(w http.ResponseWriter, r *http.Request)',
          identifier: 'handler',
          type: {
            isFunc: true,
            name: 'func(w http.ResponseWriter, r *http.Request)',
            args: [{
              name: 'w http.ResponseWriter',
              identifier: 'w',
              type: { name: 'http.ResponseWriter', isFunc: false }
            }, {
              name: 'r *http.Request',
              identifier: 'r',
              type: { name: '*http.Request', isFunc: false }
            }],
            returns: []
          }
        }, {
          name: 'otherhandler func(w http.ResponseWriter, r *http.Request)',
          identifier: 'otherhandler',
          type: {
            isFunc: true,
            name: 'func(w http.ResponseWriter, r *http.Request)',
            args: [{
              name: 'w http.ResponseWriter',
              identifier: 'w',
              type: { name: 'http.ResponseWriter', isFunc: false }
            }, {
              name: 'r *http.Request',
              identifier: 'r',
              type: { name: '*http.Request', isFunc: false }
            }],
            returns: []
          }
        }],
        returns: []
      });

      t({
        input: 'func()',
        args: [],
        returns: []
      });

      t({
        input: 'func(x int) int',
        args: [{
          name: 'x int',
          identifier: 'x',
          type: { name: 'int', isFunc: false }
        }],
        returns: [{
          name: 'int',
          identifier: '',
          type: { name: 'int', isFunc: false }
        }]
      });

      t({
        input: 'func(a, _ int, z float32) bool',
        args: [{
          name: 'a',
          identifier: '',
          type: { name: 'a', isFunc: false }
        }, {
          name: '_ int',
          identifier: '_',
          type: { name: 'int', isFunc: false }
        }, {
          name: 'z float32',
          identifier: 'z',
          type: { name: 'float32', isFunc: false }
        }],
        returns: [{
          name: 'bool',
          identifier: '',
          type: { name: 'bool', isFunc: false }
        }]
      });

      t({
        input: 'func(a, b int, z float32) (bool)',
        args: [{
          name: 'a',
          identifier: '',
          type: { name: 'a', isFunc: false }
        }, {
          name: 'b int',
          identifier: 'b',
          type: { name: 'int', isFunc: false }
        }, {
          name: 'z float32',
          identifier: 'z',
          type: { name: 'float32', isFunc: false }
        }],
        returns: [{
          name: 'bool',
          identifier: '',
          type: { name: 'bool', isFunc: false }
        }]
      });

      t({
        input: 'func(a, b int, z float64, opt ...interface{}) (success bool)',
        args: [{
          name: 'a',
          identifier: '',
          type: { name: 'a', isFunc: false }
        }, {
          name: 'b int',
          identifier: 'b',
          type: { name: 'int', isFunc: false }
        }, {
          name: 'z float64',
          identifier: 'z',
          type: { name: 'float64', isFunc: false }
        }, {
          name: 'opt ...interface{}',
          identifier: 'opt',
          type: { name: '...interface{}', isFunc: false }
        }],
        returns: [{
          name: 'success bool',
          identifier: 'success',
          type: { name: 'bool', isFunc: false }
        }]
      });

      t({
        input: 'func(prefix string, values ...int)',
        args: [{
          name: 'prefix string',
          identifier: 'prefix',
          type: { name: 'string', isFunc: false }
        }, {
          name: 'values ...int',
          identifier: 'values',
          type: { name: '...int', isFunc: false }
        }],
        returns: []
      });

      t({
        input: 'func(int, int, float64) (float64, *[]int)',
        args: [{
          name: 'int',
          identifier: '',
          type: { name: 'int', isFunc: false }
        }, {
          name: 'int',
          identifier: '',
          type: { name: 'int', isFunc: false }
        }, {
          name: 'float64',
          identifier: '',
          type: { name: 'float64', isFunc: false }
        }],
        returns: [{
          name: 'float64',
          identifier: '',
          type: { name: 'float64', isFunc: false }
        }, {
          name: '*[]int',
          identifier: '',
          type: { name: '*[]int', isFunc: false }
        }]
      });

      t({
        input: 'func(n int) func(p *T)',
        args: [{
          name: 'n int',
          identifier: 'n',
          type: { name: 'int', isFunc: false }
        }],
        returns: [{
          name: 'func(p *T)',
          identifier: '',
          type: {
            isFunc: true,
            name: 'func(p *T)',
            args: [{
              name: 'p *T',
              identifier: 'p',
              type: { name: '*T', isFunc: false }
            }],
            returns: []
          }
        }]
      });
    });
  });

  describe('generateSnippet', function () {
    var t = function t(context) {
      var result = Suggestions.generateSnippet({ snipCount: 0, argCount: 0, snippetMode: 'nameAndType' }, context.input.name, context.input.type);
      expect(result).toBeTruthy();
      expect(result.displayText).toEqual(context.result.displayText);
      expect(result.snippet).toEqual(context.result.snippet);
    };

    it('parses the function into args and returns arrays', function () {
      t({
        input: {
          name: 'Print',
          type: {
            isFunc: true,
            name: 'func()',
            args: [],
            returns: []
          }
        },
        result: {
          snippet: 'Print()',
          displayText: 'Print()'
        }
      });

      t({
        input: {
          name: 'Print',
          type: {
            isFunc: true,
            name: 'func(x int) int',
            args: [{
              name: 'x int',
              identifier: 'x',
              type: { name: 'int', isFunc: false }
            }],
            returns: [{
              name: 'int',
              identifier: '',
              type: { name: 'int', isFunc: false }
            }]
          }
        },
        result: {
          snippet: 'Print(${1:x int})', // eslint-disable-line no-template-curly-in-string
          displayText: 'Print(x int)'
        }
      });

      t({
        input: {
          name: 'ServeFunc',
          type: {
            isFunc: true,
            name: 'func(pattern string, func(w http.ResponseWriter, r *http.Request))',
            args: [{
              name: 'pattern string',
              identifier: 'pattern',
              type: { name: 'string', isFunc: false }
            }, {
              name: 'func(w http.ResponseWriter, r *http.Request)',
              identifier: '',
              type: {
                isFunc: true,
                name: 'func(w http.ResponseWriter, r *http.Request)',
                args: [{
                  name: 'w http.ResponseWriter',
                  identifier: 'w',
                  type: { name: 'http.ResponseWriter', isFunc: false }
                }, {
                  name: 'r *http.Request',
                  identifier: 'r',
                  type: { name: '*http.Request', isFunc: false }
                }],
                returns: []
              }
            }],
            returns: []
          }
        },
        result: {
          snippet: 'ServeFunc(${1:pattern string}, ${2:func(${3:w} http.ResponseWriter, ${4:r} *http.Request) {\n\t$5\n\\}})', // eslint-disable-line no-template-curly-in-string
          displayText: 'ServeFunc(pattern string, func(w http.ResponseWriter, r *http.Request))'
        }
      });

      t({
        input: {
          name: 'It',
          type: {
            isFunc: true,
            name: 'func(text string, body interface{}, timeout ...float64) bool',
            args: [{
              name: 'text string',
              identifier: 'text',
              type: { name: 'string', isFunc: false }
            }, {
              name: 'body interface{}',
              identifier: 'body',
              type: { name: 'interface{}', isFunc: false }
            }, {
              name: 'timeout ...float64',
              identifier: 'timeout',
              type: { name: '...float64', isFunc: false }
            }],
            returns: [{
              name: 'bool',
              identifier: '',
              type: { name: 'bool', isFunc: false }
            }]
          }
        },
        result: {
          // snippet: 'It(${1:text string}, ${2:body interface{\\}}, ${3:timeout ...float64})',
          snippet: 'It(${1:text string}, ${2:body interface{\\}})', // eslint-disable-line no-template-curly-in-string
          displayText: 'It(text string, body interface{}, timeout ...float64)'
        }
      });

      t({
        input: {
          name: 'Bleh',
          type: {
            isFunc: true,
            name: 'func(f func() interface{})',
            args: [{
              name: 'f func() interface{}',
              identifier: 'f',
              type: {
                isFunc: true,
                name: 'func() interface{}',
                args: [],
                returns: [{
                  name: 'interface{}',
                  identifier: '',
                  type: { name: 'interface{}', isFunc: false }
                }]
              }
            }],
            returns: []
          }
        },
        result: {
          snippet: 'Bleh(${1:func() interface{\\} {\n\t$2\n\\}})', // eslint-disable-line no-template-curly-in-string
          displayText: 'Bleh(func() interface{})'
        }
      });

      // this is just a ridiculous func to test the limits of the function...
      t({
        input: {
          name: 'Bleh',
          type: {
            isFunc: true,
            name: 'func(f func(i interface{}) func(interface{}) interface{})',
            args: [{
              name: 'f func(i interface{}) func(interface{}) interface{}',
              identifier: 'f',
              type: {
                isFunc: true,
                name: 'func(i interface{}) func(interface{}) interface{}',
                args: [{
                  name: 'i interface{}',
                  identifier: 'i',
                  type: { name: 'interface{}', isFunc: false }
                }],
                returns: [{
                  name: 'func(interface{}) interface{}',
                  identifier: '',
                  type: {
                    isFunc: true,
                    name: 'func(interface{}) interface{}',
                    args: [{
                      name: 'interface{}',
                      identifier: 'i',
                      type: { name: 'interface{}', isFunc: false }
                    }],
                    returns: [{
                      name: 'interface{}',
                      identifier: '',
                      type: { name: 'interface{}', isFunc: false }
                    }]
                  }
                }]
              }
            }],
            returns: []
          }
        },
        result: {
          snippet: 'Bleh(${1:func(${2:i} interface{\\}) func(interface{\\}) interface{\\} {\n\t$3\n\\}})', // eslint-disable-line no-template-curly-in-string
          displayText: 'Bleh(func(i interface{}) func(interface{}) interface{})'
        }
      });
      /*
      func(x int) int
      func(a, _ int, z float32) bool
      func(a, b int, z float32) (bool)
      func(prefix string, values ...int)
      func(a, b int, z float64, opt ...interface{}) (success bool)
      func(int, int, float64) (float64, *[]int)
      func(n int) func(p *T)
      */
    });
  });

  describe('ensureNextArg', function () {
    it('parses params', function () {
      var result = Suggestions.ensureNextArg(['f func() int']);
      expect(result).toEqual(['f func() int']);
      result = Suggestions.ensureNextArg(['f func() int, s string']);
      expect(result).toEqual(['f func() int', 's string']);
      result = Suggestions.ensureNextArg(['f func(s1 string, i1 int) int, s string']);
      expect(result).toEqual(['f func(s1 string, i1 int) int', 's string']);
    });
  });

  describe('toSuggestion', function () {
    var toSuggestion = function toSuggestion(candidate) {
      var o = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return Suggestions.toSuggestion(candidate, _extends({
        prefix: '',
        suffix: '',
        snippetMode: 'nameAndType'
      }, o));
    };

    it('generates snippets', function () {
      var result = toSuggestion({
        'class': 'func',
        name: 'Abc',
        type: 'func(f func() int)'
      });
      expect(result.displayText).toBe('Abc(func() int)');
      expect(result.snippet).toBe('Abc(${1:func() int {\n\t$2\n\\}})$0'); // eslint-disable-line no-template-curly-in-string

      result = toSuggestion({
        'class': 'func',
        name: 'Abc',
        type: 'func(f func() interface{})'
      });
      expect(result.displayText).toBe('Abc(func() interface{})');
      expect(result.snippet).toBe('Abc(${1:func() interface{\\} {\n\t$2\n\\}})$0'); // eslint-disable-line no-template-curly-in-string

      result = toSuggestion({
        'class': 'func',
        name: 'Abc',
        type: 'func(f func(int, string, bool) interface{})'
      });
      expect(result.displayText).toBe('Abc(func(arg1 int, arg2 string, arg3 bool) interface{})');
      expect(result.snippet).toBe('Abc(${1:func(${2:arg1} int, ${3:arg2} string, ${4:arg3} bool) interface{\\} {\n\t$5\n\\}})$0' // eslint-disable-line no-template-curly-in-string
      );

      result = toSuggestion({
        'class': 'func',
        name: 'Abc',
        type: 'func(f func() (interface{}, interface{}))'
      });
      expect(result.displayText).toBe('Abc(func() (interface{}, interface{}))');
      expect(result.snippet).toBe('Abc(${1:func() (interface{\\}, interface{\\}) {\n\t$2\n\\}})$0'); // eslint-disable-line no-template-curly-in-string

      result = toSuggestion({
        'class': 'func',
        name: 'Abc',
        type: 'func(f interface{})'
      });
      expect(result.displayText).toBe('Abc(f interface{})');
      expect(result.snippet).toBe('Abc(${1:f interface{\\}})$0'); // eslint-disable-line no-template-curly-in-string

      // type HandlerFunc func(http.ResponseWriter, *http.Request)
      result = toSuggestion({
        'class': 'type',
        name: 'HandlerFunc',
        type: 'func(http.ResponseWriter, *http.Request)'
      });
      expect(result.snippet).toBe('HandlerFunc(func(${1:arg1} http.ResponseWriter, ${2:arg2} *http.Request) {\n\t$3\n\\})$0'); // eslint-disable-line no-template-curly-in-string
      expect(result.displayText).toBe('HandlerFunc');

      // type FooBar func(int, string) string
      result = toSuggestion({
        'class': 'type',
        name: 'FooBar',
        type: 'func(int, string) string'
      });
      expect(result.snippet).toBe('FooBar(func(${1:arg1} int, ${2:arg2} string) string {\n\t$3\n\\})$0'); // eslint-disable-line no-template-curly-in-string
      expect(result.displayText).toBe('FooBar');

      // type FooBar func(int, ...string) string
      result = toSuggestion({
        'class': 'type',
        name: 'FooBar',
        type: 'func(int, ...string) string'
      });
      expect(result.snippet).toBe('FooBar(func(${1:arg1} int, ${2:arg2} ...string) string {\n\t$3\n\\})$0'); // eslint-disable-line no-template-curly-in-string
      expect(result.displayText).toBe('FooBar');
    });

    it('does not add function arguments for ( suffix', function () {
      var result = toSuggestion({
        'class': 'func',
        name: 'Abc',
        type: 'func(f func() int)'
      }, { suffix: '(' });
      expect(result.text).toBe('Abc');
      expect(result.snippet).toBeFalsy();
      expect(result.displayText).toBeFalsy();

      // type FooBar func(int, string) string
      result = toSuggestion({
        'class': 'type',
        name: 'FooBar',
        type: 'func(int, string) string'
      }, { suffix: '(' });
      expect(result.text).toBe('FooBar');
      expect(result.snippet).toBeFalsy();
      expect(result.displayText).toBeFalsy();
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9hdXRvY29tcGxldGUvc3VnZ2VzdGlvbnMtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7MENBRzZCLG9DQUFvQzs7SUFBckQsV0FBVzs7QUFIdkIsV0FBVyxDQUFBOztBQUtYLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRSxZQUFNO0FBQzNDLFVBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBTTtBQUMxQixRQUFJLENBQUMsR0FBRyxTQUFKLENBQUMsQ0FBRyxPQUFPLEVBQUk7QUFDakIsVUFBSSxLQUFLLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDaEQsWUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQzFCLFlBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVCLFlBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3BDLFlBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ25DLFlBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQ3ZDLENBQUE7O0FBRUQsTUFBRSxDQUFDLCtCQUErQixFQUFFLFlBQU07QUFDeEMsT0FBQyxDQUFDO0FBQ0EsYUFBSyxFQUFFLG1DQUFtQztBQUMxQyxZQUFJLEVBQUUsd0JBQXdCO0FBQzlCLGVBQU8sRUFBRSxNQUFNO09BQ2hCLENBQUMsQ0FBQTtBQUNGLE9BQUMsQ0FBQztBQUNBLGFBQUssRUFBRSxxQ0FBcUM7QUFDNUMsWUFBSSxFQUFFLHdCQUF3QjtBQUM5QixlQUFPLEVBQUUsTUFBTTtPQUNoQixDQUFDLENBQUE7QUFDRixPQUFDLENBQUM7QUFDQSxhQUFLLEVBQUUsOENBQThDO0FBQ3JELFlBQUksRUFBRSxtQ0FBbUM7QUFDekMsZUFBTyxFQUFFLE1BQU07T0FDaEIsQ0FBQyxDQUFBO0FBQ0YsT0FBQyxDQUFDO0FBQ0EsYUFBSyxFQUFFLGdEQUFnRDtBQUN2RCxZQUFJLEVBQUUsbUNBQW1DO0FBQ3pDLGVBQU8sRUFBRSxNQUFNO09BQ2hCLENBQUMsQ0FBQTtBQUNGLE9BQUMsQ0FBQztBQUNBLGFBQUssRUFBRSxvREFBb0Q7QUFDM0QsWUFBSSxFQUFFLHVDQUF1QztBQUM3QyxlQUFPLEVBQUUsTUFBTTtPQUNoQixDQUFDLENBQUE7QUFDRixPQUFDLENBQUM7QUFDQSxhQUFLLEVBQ0gsd0VBQXdFO0FBQzFFLFlBQUksRUFDRixrRUFBa0U7QUFDcEUsZUFBTyxFQUFFLFNBQVM7T0FDbkIsQ0FBQyxDQUFBO0FBQ0YsT0FBQyxDQUFDO0FBQ0EsYUFBSyxFQUFFLHdCQUF3QjtBQUMvQixZQUFJLEVBQUUsT0FBTztBQUNiLGVBQU8sRUFBRSxZQUFZO09BQ3RCLENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsV0FBVyxFQUFFLFlBQU07QUFDMUIsUUFBSSxDQUFDLEdBQUcsU0FBSixDQUFDLENBQUcsT0FBTyxFQUFJO0FBQ2pCLFVBQUksTUFBTSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ2pELFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUMzQixZQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO0FBQ2xDLFlBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUN6QyxZQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDaEQsQ0FBQTs7QUFFRCxNQUFFLENBQUMsa0RBQWtELEVBQUUsWUFBTTtBQUMzRCxPQUFDLENBQUM7QUFDQSxhQUFLLEVBQUUsbUNBQW1DO0FBQzFDLFlBQUksRUFBRSxDQUNKO0FBQ0UsY0FBSSxFQUFFLGFBQWE7QUFDbkIsb0JBQVUsRUFBRSxNQUFNO0FBQ2xCLGNBQUksRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUN4QyxFQUNEO0FBQ0UsY0FBSSxFQUFFLFdBQVc7QUFDakIsb0JBQVUsRUFBRSxNQUFNO0FBQ2xCLGNBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUN0QyxDQUNGO0FBQ0QsZUFBTyxFQUFFLENBQ1A7QUFDRSxjQUFJLEVBQUUsTUFBTTtBQUNaLG9CQUFVLEVBQUUsRUFBRTtBQUNkLGNBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUN0QyxDQUNGO09BQ0YsQ0FBQyxDQUFBOztBQUVGLE9BQUMsQ0FBQztBQUNBLGFBQUssRUFBRSxxQ0FBcUM7QUFDNUMsWUFBSSxFQUFFLENBQ0o7QUFDRSxjQUFJLEVBQUUsYUFBYTtBQUNuQixvQkFBVSxFQUFFLE1BQU07QUFDbEIsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3hDLEVBQ0Q7QUFDRSxjQUFJLEVBQUUsV0FBVztBQUNqQixvQkFBVSxFQUFFLE1BQU07QUFDbEIsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3RDLENBQ0Y7QUFDRCxlQUFPLEVBQUUsQ0FDUDtBQUNFLGNBQUksRUFBRSxNQUFNO0FBQ1osb0JBQVUsRUFBRSxFQUFFO0FBQ2QsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3RDLENBQ0Y7T0FDRixDQUFDLENBQUE7O0FBRUYsT0FBQyxDQUFDO0FBQ0EsYUFBSyxFQUFFLDhDQUE4QztBQUNyRCxZQUFJLEVBQUUsQ0FDSjtBQUNFLGNBQUksRUFBRSxhQUFhO0FBQ25CLG9CQUFVLEVBQUUsTUFBTTtBQUNsQixjQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7U0FDeEMsRUFDRDtBQUNFLGNBQUksRUFBRSxzQkFBc0I7QUFDNUIsb0JBQVUsRUFBRSxHQUFHO0FBQ2YsY0FBSSxFQUFFO0FBQ0osa0JBQU0sRUFBRSxJQUFJO0FBQ1osZ0JBQUksRUFBRSxvQkFBb0I7QUFDMUIsZ0JBQUksRUFBRSxDQUNKO0FBQ0Usa0JBQUksRUFBRSxjQUFjO0FBQ3BCLHdCQUFVLEVBQUUsR0FBRztBQUNmLGtCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7YUFDNUMsQ0FDRjtBQUNELG1CQUFPLEVBQUUsRUFBRTtXQUNaO1NBQ0YsQ0FDRjtBQUNELGVBQU8sRUFBRSxDQUNQO0FBQ0UsY0FBSSxFQUFFLE1BQU07QUFDWixvQkFBVSxFQUFFLEVBQUU7QUFDZCxjQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7U0FDdEMsQ0FDRjtPQUNGLENBQUMsQ0FBQTs7QUFFRixPQUFDLENBQUM7QUFDQSxhQUFLLEVBQUUsZ0RBQWdEO0FBQ3ZELFlBQUksRUFBRSxDQUNKO0FBQ0UsY0FBSSxFQUFFLGFBQWE7QUFDbkIsb0JBQVUsRUFBRSxNQUFNO0FBQ2xCLGNBQUksRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUN4QyxFQUNEO0FBQ0UsY0FBSSxFQUFFLHNCQUFzQjtBQUM1QixvQkFBVSxFQUFFLEdBQUc7QUFDZixjQUFJLEVBQUU7QUFDSixrQkFBTSxFQUFFLElBQUk7QUFDWixnQkFBSSxFQUFFLG9CQUFvQjtBQUMxQixnQkFBSSxFQUFFLENBQ0o7QUFDRSxrQkFBSSxFQUFFLGNBQWM7QUFDcEIsd0JBQVUsRUFBRSxHQUFHO0FBQ2Ysa0JBQUksRUFBRSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTthQUM1QyxDQUNGO0FBQ0QsbUJBQU8sRUFBRSxFQUFFO1dBQ1o7U0FDRixDQUNGO0FBQ0QsZUFBTyxFQUFFLENBQ1A7QUFDRSxjQUFJLEVBQUUsTUFBTTtBQUNaLG9CQUFVLEVBQUUsRUFBRTtBQUNkLGNBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUN0QyxDQUNGO09BQ0YsQ0FBQyxDQUFBOztBQUVGLE9BQUMsQ0FBQztBQUNBLGFBQUssRUFDSCx3RUFBd0U7QUFDMUUsWUFBSSxFQUFFLENBQ0o7QUFDRSxjQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLG9CQUFVLEVBQUUsU0FBUztBQUNyQixjQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7U0FDeEMsRUFDRDtBQUNFLGNBQUksRUFBRSxrREFBa0Q7QUFDeEQsb0JBQVUsRUFBRSxTQUFTO0FBQ3JCLGNBQUksRUFBRTtBQUNKLGtCQUFNLEVBQUUsSUFBSTtBQUNaLGdCQUFJLEVBQUUsMENBQTBDO0FBQ2hELGdCQUFJLEVBQUUsQ0FDSjtBQUNFLGtCQUFJLEVBQUUscUJBQXFCO0FBQzNCLHdCQUFVLEVBQUUsRUFBRTtBQUNkLGtCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTthQUNyRCxFQUNEO0FBQ0Usa0JBQUksRUFBRSxlQUFlO0FBQ3JCLHdCQUFVLEVBQUUsRUFBRTtBQUNkLGtCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7YUFDL0MsQ0FDRjtBQUNELG1CQUFPLEVBQUUsRUFBRTtXQUNaO1NBQ0YsQ0FDRjtBQUNELGVBQU8sRUFBRSxFQUFFO09BQ1osQ0FBQyxDQUFBOztBQUVGLE9BQUMsQ0FBQztBQUNBLGFBQUssRUFDSCwrSEFBK0g7QUFDakksWUFBSSxFQUFFLENBQ0o7QUFDRSxjQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLG9CQUFVLEVBQUUsU0FBUztBQUNyQixjQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7U0FDeEMsRUFDRDtBQUNFLGNBQUksRUFBRSxrREFBa0Q7QUFDeEQsb0JBQVUsRUFBRSxTQUFTO0FBQ3JCLGNBQUksRUFBRTtBQUNKLGtCQUFNLEVBQUUsSUFBSTtBQUNaLGdCQUFJLEVBQUUsMENBQTBDO0FBQ2hELGdCQUFJLEVBQUUsQ0FDSjtBQUNFLGtCQUFJLEVBQUUscUJBQXFCO0FBQzNCLHdCQUFVLEVBQUUsRUFBRTtBQUNkLGtCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTthQUNyRCxFQUNEO0FBQ0Usa0JBQUksRUFBRSxlQUFlO0FBQ3JCLHdCQUFVLEVBQUUsRUFBRTtBQUNkLGtCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7YUFDL0MsQ0FDRjtBQUNELG1CQUFPLEVBQUUsRUFBRTtXQUNaO1NBQ0YsRUFDRDtBQUNFLGNBQUksRUFBRSx1REFBdUQ7QUFDN0Qsb0JBQVUsRUFBRSxjQUFjO0FBQzFCLGNBQUksRUFBRTtBQUNKLGtCQUFNLEVBQUUsSUFBSTtBQUNaLGdCQUFJLEVBQUUsMENBQTBDO0FBQ2hELGdCQUFJLEVBQUUsQ0FDSjtBQUNFLGtCQUFJLEVBQUUscUJBQXFCO0FBQzNCLHdCQUFVLEVBQUUsRUFBRTtBQUNkLGtCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTthQUNyRCxFQUNEO0FBQ0Usa0JBQUksRUFBRSxlQUFlO0FBQ3JCLHdCQUFVLEVBQUUsRUFBRTtBQUNkLGtCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7YUFDL0MsQ0FDRjtBQUNELG1CQUFPLEVBQUUsRUFBRTtXQUNaO1NBQ0YsQ0FDRjtBQUNELGVBQU8sRUFBRSxFQUFFO09BQ1osQ0FBQyxDQUFBOztBQUVGLE9BQUMsQ0FBQztBQUNBLGFBQUssRUFDSCx1SUFBdUk7QUFDekksWUFBSSxFQUFFLENBQ0o7QUFDRSxjQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLG9CQUFVLEVBQUUsU0FBUztBQUNyQixjQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7U0FDeEMsRUFDRDtBQUNFLGNBQUksRUFBRSxzREFBc0Q7QUFDNUQsb0JBQVUsRUFBRSxTQUFTO0FBQ3JCLGNBQUksRUFBRTtBQUNKLGtCQUFNLEVBQUUsSUFBSTtBQUNaLGdCQUFJLEVBQUUsOENBQThDO0FBQ3BELGdCQUFJLEVBQUUsQ0FDSjtBQUNFLGtCQUFJLEVBQUUsdUJBQXVCO0FBQzdCLHdCQUFVLEVBQUUsR0FBRztBQUNmLGtCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTthQUNyRCxFQUNEO0FBQ0Usa0JBQUksRUFBRSxpQkFBaUI7QUFDdkIsd0JBQVUsRUFBRSxHQUFHO0FBQ2Ysa0JBQUksRUFBRSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTthQUMvQyxDQUNGO0FBQ0QsbUJBQU8sRUFBRSxFQUFFO1dBQ1o7U0FDRixFQUNEO0FBQ0UsY0FBSSxFQUFFLDJEQUEyRDtBQUNqRSxvQkFBVSxFQUFFLGNBQWM7QUFDMUIsY0FBSSxFQUFFO0FBQ0osa0JBQU0sRUFBRSxJQUFJO0FBQ1osZ0JBQUksRUFBRSw4Q0FBOEM7QUFDcEQsZ0JBQUksRUFBRSxDQUNKO0FBQ0Usa0JBQUksRUFBRSx1QkFBdUI7QUFDN0Isd0JBQVUsRUFBRSxHQUFHO0FBQ2Ysa0JBQUksRUFBRSxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2FBQ3JELEVBQ0Q7QUFDRSxrQkFBSSxFQUFFLGlCQUFpQjtBQUN2Qix3QkFBVSxFQUFFLEdBQUc7QUFDZixrQkFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2FBQy9DLENBQ0Y7QUFDRCxtQkFBTyxFQUFFLEVBQUU7V0FDWjtTQUNGLENBQ0Y7QUFDRCxlQUFPLEVBQUUsRUFBRTtPQUNaLENBQUMsQ0FBQTs7QUFFRixPQUFDLENBQUM7QUFDQSxhQUFLLEVBQUUsUUFBUTtBQUNmLFlBQUksRUFBRSxFQUFFO0FBQ1IsZUFBTyxFQUFFLEVBQUU7T0FDWixDQUFDLENBQUE7O0FBRUYsT0FBQyxDQUFDO0FBQ0EsYUFBSyxFQUFFLGlCQUFpQjtBQUN4QixZQUFJLEVBQUUsQ0FDSjtBQUNFLGNBQUksRUFBRSxPQUFPO0FBQ2Isb0JBQVUsRUFBRSxHQUFHO0FBQ2YsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3JDLENBQ0Y7QUFDRCxlQUFPLEVBQUUsQ0FDUDtBQUNFLGNBQUksRUFBRSxLQUFLO0FBQ1gsb0JBQVUsRUFBRSxFQUFFO0FBQ2QsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3JDLENBQ0Y7T0FDRixDQUFDLENBQUE7O0FBRUYsT0FBQyxDQUFDO0FBQ0EsYUFBSyxFQUFFLGdDQUFnQztBQUN2QyxZQUFJLEVBQUUsQ0FDSjtBQUNFLGNBQUksRUFBRSxHQUFHO0FBQ1Qsb0JBQVUsRUFBRSxFQUFFO0FBQ2QsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ25DLEVBQ0Q7QUFDRSxjQUFJLEVBQUUsT0FBTztBQUNiLG9CQUFVLEVBQUUsR0FBRztBQUNmLGNBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUNyQyxFQUNEO0FBQ0UsY0FBSSxFQUFFLFdBQVc7QUFDakIsb0JBQVUsRUFBRSxHQUFHO0FBQ2YsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3pDLENBQ0Y7QUFDRCxlQUFPLEVBQUUsQ0FDUDtBQUNFLGNBQUksRUFBRSxNQUFNO0FBQ1osb0JBQVUsRUFBRSxFQUFFO0FBQ2QsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3RDLENBQ0Y7T0FDRixDQUFDLENBQUE7O0FBRUYsT0FBQyxDQUFDO0FBQ0EsYUFBSyxFQUFFLGtDQUFrQztBQUN6QyxZQUFJLEVBQUUsQ0FDSjtBQUNFLGNBQUksRUFBRSxHQUFHO0FBQ1Qsb0JBQVUsRUFBRSxFQUFFO0FBQ2QsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ25DLEVBQ0Q7QUFDRSxjQUFJLEVBQUUsT0FBTztBQUNiLG9CQUFVLEVBQUUsR0FBRztBQUNmLGNBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUNyQyxFQUNEO0FBQ0UsY0FBSSxFQUFFLFdBQVc7QUFDakIsb0JBQVUsRUFBRSxHQUFHO0FBQ2YsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3pDLENBQ0Y7QUFDRCxlQUFPLEVBQUUsQ0FDUDtBQUNFLGNBQUksRUFBRSxNQUFNO0FBQ1osb0JBQVUsRUFBRSxFQUFFO0FBQ2QsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3RDLENBQ0Y7T0FDRixDQUFDLENBQUE7O0FBRUYsT0FBQyxDQUFDO0FBQ0EsYUFBSyxFQUFFLDhEQUE4RDtBQUNyRSxZQUFJLEVBQUUsQ0FDSjtBQUNFLGNBQUksRUFBRSxHQUFHO0FBQ1Qsb0JBQVUsRUFBRSxFQUFFO0FBQ2QsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ25DLEVBQ0Q7QUFDRSxjQUFJLEVBQUUsT0FBTztBQUNiLG9CQUFVLEVBQUUsR0FBRztBQUNmLGNBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUNyQyxFQUNEO0FBQ0UsY0FBSSxFQUFFLFdBQVc7QUFDakIsb0JBQVUsRUFBRSxHQUFHO0FBQ2YsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3pDLEVBQ0Q7QUFDRSxjQUFJLEVBQUUsb0JBQW9CO0FBQzFCLG9CQUFVLEVBQUUsS0FBSztBQUNqQixjQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUNoRCxDQUNGO0FBQ0QsZUFBTyxFQUFFLENBQ1A7QUFDRSxjQUFJLEVBQUUsY0FBYztBQUNwQixvQkFBVSxFQUFFLFNBQVM7QUFDckIsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3RDLENBQ0Y7T0FDRixDQUFDLENBQUE7O0FBRUYsT0FBQyxDQUFDO0FBQ0EsYUFBSyxFQUFFLG9DQUFvQztBQUMzQyxZQUFJLEVBQUUsQ0FDSjtBQUNFLGNBQUksRUFBRSxlQUFlO0FBQ3JCLG9CQUFVLEVBQUUsUUFBUTtBQUNwQixjQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7U0FDeEMsRUFDRDtBQUNFLGNBQUksRUFBRSxlQUFlO0FBQ3JCLG9CQUFVLEVBQUUsUUFBUTtBQUNwQixjQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7U0FDeEMsQ0FDRjtBQUNELGVBQU8sRUFBRSxFQUFFO09BQ1osQ0FBQyxDQUFBOztBQUVGLE9BQUMsQ0FBQztBQUNBLGFBQUssRUFBRSwyQ0FBMkM7QUFDbEQsWUFBSSxFQUFFLENBQ0o7QUFDRSxjQUFJLEVBQUUsS0FBSztBQUNYLG9CQUFVLEVBQUUsRUFBRTtBQUNkLGNBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUNyQyxFQUNEO0FBQ0UsY0FBSSxFQUFFLEtBQUs7QUFDWCxvQkFBVSxFQUFFLEVBQUU7QUFDZCxjQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7U0FDckMsRUFDRDtBQUNFLGNBQUksRUFBRSxTQUFTO0FBQ2Ysb0JBQVUsRUFBRSxFQUFFO0FBQ2QsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3pDLENBQ0Y7QUFDRCxlQUFPLEVBQUUsQ0FDUDtBQUNFLGNBQUksRUFBRSxTQUFTO0FBQ2Ysb0JBQVUsRUFBRSxFQUFFO0FBQ2QsY0FBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1NBQ3pDLEVBQ0Q7QUFDRSxjQUFJLEVBQUUsUUFBUTtBQUNkLG9CQUFVLEVBQUUsRUFBRTtBQUNkLGNBQUksRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUN4QyxDQUNGO09BQ0YsQ0FBQyxDQUFBOztBQUVGLE9BQUMsQ0FBQztBQUNBLGFBQUssRUFBRSx3QkFBd0I7QUFDL0IsWUFBSSxFQUFFLENBQ0o7QUFDRSxjQUFJLEVBQUUsT0FBTztBQUNiLG9CQUFVLEVBQUUsR0FBRztBQUNmLGNBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUNyQyxDQUNGO0FBQ0QsZUFBTyxFQUFFLENBQ1A7QUFDRSxjQUFJLEVBQUUsWUFBWTtBQUNsQixvQkFBVSxFQUFFLEVBQUU7QUFDZCxjQUFJLEVBQUU7QUFDSixrQkFBTSxFQUFFLElBQUk7QUFDWixnQkFBSSxFQUFFLFlBQVk7QUFDbEIsZ0JBQUksRUFBRSxDQUNKO0FBQ0Usa0JBQUksRUFBRSxNQUFNO0FBQ1osd0JBQVUsRUFBRSxHQUFHO0FBQ2Ysa0JBQUksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTthQUNwQyxDQUNGO0FBQ0QsbUJBQU8sRUFBRSxFQUFFO1dBQ1o7U0FDRixDQUNGO09BQ0YsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFNO0FBQ2hDLFFBQU0sQ0FBQyxHQUFHLFNBQUosQ0FBQyxDQUFHLE9BQU8sRUFBSTtBQUNuQixVQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsZUFBZSxDQUN4QyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLEVBQ3pELE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDbkIsQ0FBQTtBQUNELFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUMzQixZQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQzlELFlBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDdkQsQ0FBQTs7QUFFRCxNQUFFLENBQUMsa0RBQWtELEVBQUUsWUFBTTtBQUMzRCxPQUFDLENBQUM7QUFDQSxhQUFLLEVBQUU7QUFDTCxjQUFJLEVBQUUsT0FBTztBQUNiLGNBQUksRUFBRTtBQUNKLGtCQUFNLEVBQUUsSUFBSTtBQUNaLGdCQUFJLEVBQUUsUUFBUTtBQUNkLGdCQUFJLEVBQUUsRUFBRTtBQUNSLG1CQUFPLEVBQUUsRUFBRTtXQUNaO1NBQ0Y7QUFDRCxjQUFNLEVBQUU7QUFDTixpQkFBTyxFQUFFLFNBQVM7QUFDbEIscUJBQVcsRUFBRSxTQUFTO1NBQ3ZCO09BQ0YsQ0FBQyxDQUFBOztBQUVGLE9BQUMsQ0FBQztBQUNBLGFBQUssRUFBRTtBQUNMLGNBQUksRUFBRSxPQUFPO0FBQ2IsY0FBSSxFQUFFO0FBQ0osa0JBQU0sRUFBRSxJQUFJO0FBQ1osZ0JBQUksRUFBRSxpQkFBaUI7QUFDdkIsZ0JBQUksRUFBRSxDQUNKO0FBQ0Usa0JBQUksRUFBRSxPQUFPO0FBQ2Isd0JBQVUsRUFBRSxHQUFHO0FBQ2Ysa0JBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTthQUNyQyxDQUNGO0FBQ0QsbUJBQU8sRUFBRSxDQUNQO0FBQ0Usa0JBQUksRUFBRSxLQUFLO0FBQ1gsd0JBQVUsRUFBRSxFQUFFO0FBQ2Qsa0JBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTthQUNyQyxDQUNGO1dBQ0Y7U0FDRjtBQUNELGNBQU0sRUFBRTtBQUNOLGlCQUFPLEVBQUUsbUJBQW1CO0FBQzVCLHFCQUFXLEVBQUUsY0FBYztTQUM1QjtPQUNGLENBQUMsQ0FBQTs7QUFFRixPQUFDLENBQUM7QUFDQSxhQUFLLEVBQUU7QUFDTCxjQUFJLEVBQUUsV0FBVztBQUNqQixjQUFJLEVBQUU7QUFDSixrQkFBTSxFQUFFLElBQUk7QUFDWixnQkFBSSxFQUNGLG9FQUFvRTtBQUN0RSxnQkFBSSxFQUFFLENBQ0o7QUFDRSxrQkFBSSxFQUFFLGdCQUFnQjtBQUN0Qix3QkFBVSxFQUFFLFNBQVM7QUFDckIsa0JBQUksRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTthQUN4QyxFQUNEO0FBQ0Usa0JBQUksRUFBRSw4Q0FBOEM7QUFDcEQsd0JBQVUsRUFBRSxFQUFFO0FBQ2Qsa0JBQUksRUFBRTtBQUNKLHNCQUFNLEVBQUUsSUFBSTtBQUNaLG9CQUFJLEVBQUUsOENBQThDO0FBQ3BELG9CQUFJLEVBQUUsQ0FDSjtBQUNFLHNCQUFJLEVBQUUsdUJBQXVCO0FBQzdCLDRCQUFVLEVBQUUsR0FBRztBQUNmLHNCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtpQkFDckQsRUFDRDtBQUNFLHNCQUFJLEVBQUUsaUJBQWlCO0FBQ3ZCLDRCQUFVLEVBQUUsR0FBRztBQUNmLHNCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7aUJBQy9DLENBQ0Y7QUFDRCx1QkFBTyxFQUFFLEVBQUU7ZUFDWjthQUNGLENBQ0Y7QUFDRCxtQkFBTyxFQUFFLEVBQUU7V0FDWjtTQUNGO0FBQ0QsY0FBTSxFQUFFO0FBQ04saUJBQU8sRUFDTCwwR0FBMEc7QUFDNUcscUJBQVcsRUFDVCx5RUFBeUU7U0FDNUU7T0FDRixDQUFDLENBQUE7O0FBRUYsT0FBQyxDQUFDO0FBQ0EsYUFBSyxFQUFFO0FBQ0wsY0FBSSxFQUFFLElBQUk7QUFDVixjQUFJLEVBQUU7QUFDSixrQkFBTSxFQUFFLElBQUk7QUFDWixnQkFBSSxFQUNGLDhEQUE4RDtBQUNoRSxnQkFBSSxFQUFFLENBQ0o7QUFDRSxrQkFBSSxFQUFFLGFBQWE7QUFDbkIsd0JBQVUsRUFBRSxNQUFNO0FBQ2xCLGtCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7YUFDeEMsRUFDRDtBQUNFLGtCQUFJLEVBQUUsa0JBQWtCO0FBQ3hCLHdCQUFVLEVBQUUsTUFBTTtBQUNsQixrQkFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2FBQzdDLEVBQ0Q7QUFDRSxrQkFBSSxFQUFFLG9CQUFvQjtBQUMxQix3QkFBVSxFQUFFLFNBQVM7QUFDckIsa0JBQUksRUFBRSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTthQUM1QyxDQUNGO0FBQ0QsbUJBQU8sRUFBRSxDQUNQO0FBQ0Usa0JBQUksRUFBRSxNQUFNO0FBQ1osd0JBQVUsRUFBRSxFQUFFO0FBQ2Qsa0JBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTthQUN0QyxDQUNGO1dBQ0Y7U0FDRjtBQUNELGNBQU0sRUFBRTs7QUFFTixpQkFBTyxFQUFFLCtDQUErQztBQUN4RCxxQkFBVyxFQUFFLHVEQUF1RDtTQUNyRTtPQUNGLENBQUMsQ0FBQTs7QUFFRixPQUFDLENBQUM7QUFDQSxhQUFLLEVBQUU7QUFDTCxjQUFJLEVBQUUsTUFBTTtBQUNaLGNBQUksRUFBRTtBQUNKLGtCQUFNLEVBQUUsSUFBSTtBQUNaLGdCQUFJLEVBQUUsNEJBQTRCO0FBQ2xDLGdCQUFJLEVBQUUsQ0FDSjtBQUNFLGtCQUFJLEVBQUUsc0JBQXNCO0FBQzVCLHdCQUFVLEVBQUUsR0FBRztBQUNmLGtCQUFJLEVBQUU7QUFDSixzQkFBTSxFQUFFLElBQUk7QUFDWixvQkFBSSxFQUFFLG9CQUFvQjtBQUMxQixvQkFBSSxFQUFFLEVBQUU7QUFDUix1QkFBTyxFQUFFLENBQ1A7QUFDRSxzQkFBSSxFQUFFLGFBQWE7QUFDbkIsNEJBQVUsRUFBRSxFQUFFO0FBQ2Qsc0JBQUksRUFBRSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtpQkFDN0MsQ0FDRjtlQUNGO2FBQ0YsQ0FDRjtBQUNELG1CQUFPLEVBQUUsRUFBRTtXQUNaO1NBQ0Y7QUFDRCxjQUFNLEVBQUU7QUFDTixpQkFBTyxFQUFFLDhDQUE4QztBQUN2RCxxQkFBVyxFQUFFLDBCQUEwQjtTQUN4QztPQUNGLENBQUMsQ0FBQTs7O0FBR0YsT0FBQyxDQUFDO0FBQ0EsYUFBSyxFQUFFO0FBQ0wsY0FBSSxFQUFFLE1BQU07QUFDWixjQUFJLEVBQUU7QUFDSixrQkFBTSxFQUFFLElBQUk7QUFDWixnQkFBSSxFQUFFLDJEQUEyRDtBQUNqRSxnQkFBSSxFQUFFLENBQ0o7QUFDRSxrQkFBSSxFQUFFLHFEQUFxRDtBQUMzRCx3QkFBVSxFQUFFLEdBQUc7QUFDZixrQkFBSSxFQUFFO0FBQ0osc0JBQU0sRUFBRSxJQUFJO0FBQ1osb0JBQUksRUFBRSxtREFBbUQ7QUFDekQsb0JBQUksRUFBRSxDQUNKO0FBQ0Usc0JBQUksRUFBRSxlQUFlO0FBQ3JCLDRCQUFVLEVBQUUsR0FBRztBQUNmLHNCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7aUJBQzdDLENBQ0Y7QUFDRCx1QkFBTyxFQUFFLENBQ1A7QUFDRSxzQkFBSSxFQUFFLCtCQUErQjtBQUNyQyw0QkFBVSxFQUFFLEVBQUU7QUFDZCxzQkFBSSxFQUFFO0FBQ0osMEJBQU0sRUFBRSxJQUFJO0FBQ1osd0JBQUksRUFBRSwrQkFBK0I7QUFDckMsd0JBQUksRUFBRSxDQUNKO0FBQ0UsMEJBQUksRUFBRSxhQUFhO0FBQ25CLGdDQUFVLEVBQUUsR0FBRztBQUNmLDBCQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7cUJBQzdDLENBQ0Y7QUFDRCwyQkFBTyxFQUFFLENBQ1A7QUFDRSwwQkFBSSxFQUFFLGFBQWE7QUFDbkIsZ0NBQVUsRUFBRSxFQUFFO0FBQ2QsMEJBQUksRUFBRSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtxQkFDN0MsQ0FDRjttQkFDRjtpQkFDRixDQUNGO2VBQ0Y7YUFDRixDQUNGO0FBQ0QsbUJBQU8sRUFBRSxFQUFFO1dBQ1o7U0FDRjtBQUNELGNBQU0sRUFBRTtBQUNOLGlCQUFPLEVBQ0wsc0ZBQXNGO0FBQ3hGLHFCQUFXLEVBQUUseURBQXlEO1NBQ3ZFO09BQ0YsQ0FBQyxDQUFBOzs7Ozs7Ozs7O0tBVUgsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBTTtBQUM5QixNQUFFLENBQUMsZUFBZSxFQUFFLFlBQU07QUFDeEIsVUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUE7QUFDeEQsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUE7QUFDeEMsWUFBTSxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUE7QUFDOUQsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFBO0FBQ3BELFlBQU0sR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQ2pDLHlDQUF5QyxDQUMxQyxDQUFDLENBQUE7QUFDRixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsK0JBQStCLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQTtLQUN0RSxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFNO0FBQzdCLFFBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLFNBQVMsRUFBYTtVQUFYLENBQUMseURBQUcsRUFBRTs7QUFDckMsYUFBTyxXQUFXLENBQUMsWUFBWSxDQUFDLFNBQVM7QUFDdkMsY0FBTSxFQUFFLEVBQUU7QUFDVixjQUFNLEVBQUUsRUFBRTtBQUNWLG1CQUFXLEVBQUUsYUFBYTtTQUN2QixDQUFDLEVBQ0osQ0FBQTtLQUNILENBQUE7O0FBRUQsTUFBRSxDQUFDLG9CQUFvQixFQUFFLFlBQU07QUFDN0IsVUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBQ3hCLGlCQUFPLE1BQU07QUFDYixZQUFJLEVBQUUsS0FBSztBQUNYLFlBQUksRUFBRSxvQkFBb0I7T0FDM0IsQ0FBQyxDQUFBO0FBQ0YsWUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUNsRCxZQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBOztBQUVsRSxZQUFNLEdBQUcsWUFBWSxDQUFDO0FBQ3BCLGlCQUFPLE1BQU07QUFDYixZQUFJLEVBQUUsS0FBSztBQUNYLFlBQUksRUFBRSw0QkFBNEI7T0FDbkMsQ0FBQyxDQUFBO0FBQ0YsWUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQTtBQUMxRCxZQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDekIsK0NBQStDLENBQ2hELENBQUE7O0FBRUQsWUFBTSxHQUFHLFlBQVksQ0FBQztBQUNwQixpQkFBTyxNQUFNO0FBQ2IsWUFBSSxFQUFFLEtBQUs7QUFDWCxZQUFJLEVBQUUsNkNBQTZDO09BQ3BELENBQUMsQ0FBQTtBQUNGLFlBQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUM3Qix5REFBeUQsQ0FDMUQsQ0FBQTtBQUNELFlBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUN6Qiw4RkFBOEY7T0FDL0YsQ0FBQTs7QUFFRCxZQUFNLEdBQUcsWUFBWSxDQUFDO0FBQ3BCLGlCQUFPLE1BQU07QUFDYixZQUFJLEVBQUUsS0FBSztBQUNYLFlBQUksRUFBRSwyQ0FBMkM7T0FDbEQsQ0FBQyxDQUFBO0FBQ0YsWUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQTtBQUN6RSxZQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDekIsZ0VBQWdFLENBQ2pFLENBQUE7O0FBRUQsWUFBTSxHQUFHLFlBQVksQ0FBQztBQUNwQixpQkFBTyxNQUFNO0FBQ2IsWUFBSSxFQUFFLEtBQUs7QUFDWCxZQUFJLEVBQUUscUJBQXFCO09BQzVCLENBQUMsQ0FBQTtBQUNGLFlBQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFDckQsWUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQTs7O0FBRzFELFlBQU0sR0FBRyxZQUFZLENBQUM7QUFDcEIsaUJBQU8sTUFBTTtBQUNiLFlBQUksRUFBRSxhQUFhO0FBQ25CLFlBQUksRUFBRSwwQ0FBMEM7T0FDakQsQ0FBQyxDQUFBO0FBQ0YsWUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQ3pCLDBGQUEwRixDQUMzRixDQUFBO0FBQ0QsWUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7OztBQUc5QyxZQUFNLEdBQUcsWUFBWSxDQUFDO0FBQ3BCLGlCQUFPLE1BQU07QUFDYixZQUFJLEVBQUUsUUFBUTtBQUNkLFlBQUksRUFBRSwwQkFBMEI7T0FDakMsQ0FBQyxDQUFBO0FBQ0YsWUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQ3pCLHFFQUFxRSxDQUN0RSxDQUFBO0FBQ0QsWUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7OztBQUd6QyxZQUFNLEdBQUcsWUFBWSxDQUFDO0FBQ3BCLGlCQUFPLE1BQU07QUFDYixZQUFJLEVBQUUsUUFBUTtBQUNkLFlBQUksRUFBRSw2QkFBNkI7T0FDcEMsQ0FBQyxDQUFBO0FBQ0YsWUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQ3pCLHdFQUF3RSxDQUN6RSxDQUFBO0FBQ0QsWUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDMUMsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyw4Q0FBOEMsRUFBRSxZQUFNO0FBQ3ZELFVBQUksTUFBTSxHQUFHLFlBQVksQ0FDdkI7QUFDRSxpQkFBTyxNQUFNO0FBQ2IsWUFBSSxFQUFFLEtBQUs7QUFDWCxZQUFJLEVBQUUsb0JBQW9CO09BQzNCLEVBQ0QsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQ2hCLENBQUE7QUFDRCxZQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMvQixZQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ2xDLFlBQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUE7OztBQUd0QyxZQUFNLEdBQUcsWUFBWSxDQUNuQjtBQUNFLGlCQUFPLE1BQU07QUFDYixZQUFJLEVBQUUsUUFBUTtBQUNkLFlBQUksRUFBRSwwQkFBMEI7T0FDakMsRUFDRCxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FDaEIsQ0FBQTtBQUNELFlBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2xDLFlBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDbEMsWUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtLQUN2QyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9zcGVjL2F1dG9jb21wbGV0ZS9zdWdnZXN0aW9ucy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuXG5pbXBvcnQgKiBhcyBTdWdnZXN0aW9ucyBmcm9tICcuLi8uLi9saWIvYXV0b2NvbXBsZXRlL3N1Z2dlc3Rpb25zJ1xuXG5kZXNjcmliZSgnZ29jb2RlcHJvdmlkZXItc3VnZ2VzdGlvbnMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdtYXRjaEZ1bmMnLCAoKSA9PiB7XG4gICAgbGV0IHQgPSBjb250ZXh0ID0+IHtcbiAgICAgIGxldCBtYXRjaCA9IFN1Z2dlc3Rpb25zLm1hdGNoRnVuYyhjb250ZXh0LmlucHV0KVxuICAgICAgZXhwZWN0KG1hdGNoKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChtYXRjaC5sZW5ndGgpLnRvQmUoMylcbiAgICAgIGV4cGVjdChtYXRjaFswXSkudG9CZShjb250ZXh0LmlucHV0KVxuICAgICAgZXhwZWN0KG1hdGNoWzFdKS50b0JlKGNvbnRleHQuYXJncylcbiAgICAgIGV4cGVjdChtYXRjaFsyXSkudG9CZShjb250ZXh0LnJldHVybnMpXG4gICAgfVxuXG4gICAgaXQoJ2lkZW50aWZpZXMgZnVuY3Rpb24gYXJndW1lbnRzJywgKCkgPT4ge1xuICAgICAgdCh7XG4gICAgICAgIGlucHV0OiAnZnVuYyhuYW1lIHN0cmluZywgZmxhZyBib29sKSBib29sJyxcbiAgICAgICAgYXJnczogJ25hbWUgc3RyaW5nLCBmbGFnIGJvb2wnLFxuICAgICAgICByZXR1cm5zOiAnYm9vbCdcbiAgICAgIH0pXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6ICdmdW5jKG5hbWUgc3RyaW5nLCBmbGFnIGJvb2wpIChib29sKScsXG4gICAgICAgIGFyZ3M6ICduYW1lIHN0cmluZywgZmxhZyBib29sJyxcbiAgICAgICAgcmV0dXJuczogJ2Jvb2wnXG4gICAgICB9KVxuICAgICAgdCh7XG4gICAgICAgIGlucHV0OiAnZnVuYyhuYW1lIHN0cmluZywgZiBmdW5jKHQgKnRlc3RpbmcuVCkpIGJvb2wnLFxuICAgICAgICBhcmdzOiAnbmFtZSBzdHJpbmcsIGYgZnVuYyh0ICp0ZXN0aW5nLlQpJyxcbiAgICAgICAgcmV0dXJuczogJ2Jvb2wnXG4gICAgICB9KVxuICAgICAgdCh7XG4gICAgICAgIGlucHV0OiAnZnVuYyhuYW1lIHN0cmluZywgZiBmdW5jKHQgKnRlc3RpbmcuVCkpIChib29sKScsXG4gICAgICAgIGFyZ3M6ICduYW1lIHN0cmluZywgZiBmdW5jKHQgKnRlc3RpbmcuVCknLFxuICAgICAgICByZXR1cm5zOiAnYm9vbCdcbiAgICAgIH0pXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6ICdmdW5jKG5hbWUgc3RyaW5nLCBmIGZ1bmModCAqdGVzdGluZy5UKSBpbnQpIChib29sKScsXG4gICAgICAgIGFyZ3M6ICduYW1lIHN0cmluZywgZiBmdW5jKHQgKnRlc3RpbmcuVCkgaW50JyxcbiAgICAgICAgcmV0dXJuczogJ2Jvb2wnXG4gICAgICB9KVxuICAgICAgdCh7XG4gICAgICAgIGlucHV0OlxuICAgICAgICAgICdmdW5jKHBhdHRlcm4gc3RyaW5nLCBoYW5kbGVyIGZ1bmMoaHR0cC5SZXNwb25zZVdyaXRlciwgKmh0dHAuUmVxdWVzdCkpJyxcbiAgICAgICAgYXJnczpcbiAgICAgICAgICAncGF0dGVybiBzdHJpbmcsIGhhbmRsZXIgZnVuYyhodHRwLlJlc3BvbnNlV3JpdGVyLCAqaHR0cC5SZXF1ZXN0KScsXG4gICAgICAgIHJldHVybnM6IHVuZGVmaW5lZFxuICAgICAgfSlcbiAgICAgIHQoe1xuICAgICAgICBpbnB1dDogJ2Z1bmMobiBpbnQpIGZ1bmMocCAqVCknLFxuICAgICAgICBhcmdzOiAnbiBpbnQnLFxuICAgICAgICByZXR1cm5zOiAnZnVuYyhwICpUKSdcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgncGFyc2VUeXBlJywgKCkgPT4ge1xuICAgIGxldCB0ID0gY29udGV4dCA9PiB7XG4gICAgICBsZXQgcmVzdWx0ID0gU3VnZ2VzdGlvbnMucGFyc2VUeXBlKGNvbnRleHQuaW5wdXQpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChyZXN1bHQuaXNGdW5jKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChyZXN1bHQuYXJncykudG9FcXVhbChjb250ZXh0LmFyZ3MpXG4gICAgICBleHBlY3QocmVzdWx0LnJldHVybnMpLnRvRXF1YWwoY29udGV4dC5yZXR1cm5zKVxuICAgIH1cblxuICAgIGl0KCdwYXJzZXMgdGhlIGZ1bmN0aW9uIGludG8gYXJncyBhbmQgcmV0dXJucyBhcnJheXMnLCAoKSA9PiB7XG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6ICdmdW5jKG5hbWUgc3RyaW5nLCBmbGFnIGJvb2wpIGJvb2wnLFxuICAgICAgICBhcmdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ25hbWUgc3RyaW5nJyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICduYW1lJyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ3N0cmluZycsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2ZsYWcgYm9vbCcsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAnZmxhZycsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdib29sJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICByZXR1cm5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2Jvb2wnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJycsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdib29sJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KVxuXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6ICdmdW5jKG5hbWUgc3RyaW5nLCBmbGFnIGJvb2wpIChib29sKScsXG4gICAgICAgIGFyZ3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnbmFtZSBzdHJpbmcnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJ25hbWUnLFxuICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnc3RyaW5nJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnZmxhZyBib29sJyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICdmbGFnJyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2Jvb2wnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHJldHVybnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnYm9vbCcsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAnJyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2Jvb2wnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pXG5cbiAgICAgIHQoe1xuICAgICAgICBpbnB1dDogJ2Z1bmMobmFtZSBzdHJpbmcsIGYgZnVuYyh0ICp0ZXN0aW5nLlQpKSBib29sJyxcbiAgICAgICAgYXJnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICduYW1lIHN0cmluZycsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAnbmFtZScsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdzdHJpbmcnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdmIGZ1bmModCAqdGVzdGluZy5UKScsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAnZicsXG4gICAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICAgIGlzRnVuYzogdHJ1ZSxcbiAgICAgICAgICAgICAgbmFtZTogJ2Z1bmModCAqdGVzdGluZy5UKScsXG4gICAgICAgICAgICAgIGFyZ3M6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAndCAqdGVzdGluZy5UJyxcbiAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICd0JyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJyp0ZXN0aW5nLlQnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIHJldHVybnM6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICByZXR1cm5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2Jvb2wnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJycsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdib29sJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KVxuXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6ICdmdW5jKG5hbWUgc3RyaW5nLCBmIGZ1bmModCAqdGVzdGluZy5UKSkgKGJvb2wpJyxcbiAgICAgICAgYXJnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICduYW1lIHN0cmluZycsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAnbmFtZScsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdzdHJpbmcnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdmIGZ1bmModCAqdGVzdGluZy5UKScsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAnZicsXG4gICAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICAgIGlzRnVuYzogdHJ1ZSxcbiAgICAgICAgICAgICAgbmFtZTogJ2Z1bmModCAqdGVzdGluZy5UKScsXG4gICAgICAgICAgICAgIGFyZ3M6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAndCAqdGVzdGluZy5UJyxcbiAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICd0JyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJyp0ZXN0aW5nLlQnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIHJldHVybnM6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICByZXR1cm5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2Jvb2wnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJycsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdib29sJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KVxuXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6XG4gICAgICAgICAgJ2Z1bmMocGF0dGVybiBzdHJpbmcsIGhhbmRsZXIgZnVuYyhodHRwLlJlc3BvbnNlV3JpdGVyLCAqaHR0cC5SZXF1ZXN0KSknLFxuICAgICAgICBhcmdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3BhdHRlcm4gc3RyaW5nJyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICdwYXR0ZXJuJyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ3N0cmluZycsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2hhbmRsZXIgZnVuYyhodHRwLlJlc3BvbnNlV3JpdGVyLCAqaHR0cC5SZXF1ZXN0KScsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAnaGFuZGxlcicsXG4gICAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICAgIGlzRnVuYzogdHJ1ZSxcbiAgICAgICAgICAgICAgbmFtZTogJ2Z1bmMoaHR0cC5SZXNwb25zZVdyaXRlciwgKmh0dHAuUmVxdWVzdCknLFxuICAgICAgICAgICAgICBhcmdzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbmFtZTogJ2h0dHAuUmVzcG9uc2VXcml0ZXInLFxuICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJycsXG4gICAgICAgICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdodHRwLlJlc3BvbnNlV3JpdGVyJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAnKmh0dHAuUmVxdWVzdCcsXG4gICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnJyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJypodHRwLlJlcXVlc3QnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIHJldHVybnM6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICByZXR1cm5zOiBbXVxuICAgICAgfSlcblxuICAgICAgdCh7XG4gICAgICAgIGlucHV0OlxuICAgICAgICAgICdmdW5jKHBhdHRlcm4gc3RyaW5nLCBoYW5kbGVyIGZ1bmMoaHR0cC5SZXNwb25zZVdyaXRlciwgKmh0dHAuUmVxdWVzdCksIG90aGVyaGFuZGxlciBmdW5jKGh0dHAuUmVzcG9uc2VXcml0ZXIsICpodHRwLlJlcXVlc3QpKScsXG4gICAgICAgIGFyZ3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncGF0dGVybiBzdHJpbmcnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJ3BhdHRlcm4nLFxuICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnc3RyaW5nJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnaGFuZGxlciBmdW5jKGh0dHAuUmVzcG9uc2VXcml0ZXIsICpodHRwLlJlcXVlc3QpJyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICdoYW5kbGVyJyxcbiAgICAgICAgICAgIHR5cGU6IHtcbiAgICAgICAgICAgICAgaXNGdW5jOiB0cnVlLFxuICAgICAgICAgICAgICBuYW1lOiAnZnVuYyhodHRwLlJlc3BvbnNlV3JpdGVyLCAqaHR0cC5SZXF1ZXN0KScsXG4gICAgICAgICAgICAgIGFyZ3M6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAnaHR0cC5SZXNwb25zZVdyaXRlcicsXG4gICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnJyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2h0dHAuUmVzcG9uc2VXcml0ZXInLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICcqaHR0cC5SZXF1ZXN0JyxcbiAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnKmh0dHAuUmVxdWVzdCcsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgcmV0dXJuczogW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdvdGhlcmhhbmRsZXIgZnVuYyhodHRwLlJlc3BvbnNlV3JpdGVyLCAqaHR0cC5SZXF1ZXN0KScsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAnb3RoZXJoYW5kbGVyJyxcbiAgICAgICAgICAgIHR5cGU6IHtcbiAgICAgICAgICAgICAgaXNGdW5jOiB0cnVlLFxuICAgICAgICAgICAgICBuYW1lOiAnZnVuYyhodHRwLlJlc3BvbnNlV3JpdGVyLCAqaHR0cC5SZXF1ZXN0KScsXG4gICAgICAgICAgICAgIGFyZ3M6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAnaHR0cC5SZXNwb25zZVdyaXRlcicsXG4gICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnJyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2h0dHAuUmVzcG9uc2VXcml0ZXInLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICcqaHR0cC5SZXF1ZXN0JyxcbiAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnKmh0dHAuUmVxdWVzdCcsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgcmV0dXJuczogW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHJldHVybnM6IFtdXG4gICAgICB9KVxuXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6XG4gICAgICAgICAgJ2Z1bmMocGF0dGVybiBzdHJpbmcsIGhhbmRsZXIgZnVuYyh3IGh0dHAuUmVzcG9uc2VXcml0ZXIsIHIgKmh0dHAuUmVxdWVzdCksIG90aGVyaGFuZGxlciBmdW5jKHcgaHR0cC5SZXNwb25zZVdyaXRlciwgciAqaHR0cC5SZXF1ZXN0KSknLFxuICAgICAgICBhcmdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3BhdHRlcm4gc3RyaW5nJyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICdwYXR0ZXJuJyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ3N0cmluZycsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2hhbmRsZXIgZnVuYyh3IGh0dHAuUmVzcG9uc2VXcml0ZXIsIHIgKmh0dHAuUmVxdWVzdCknLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJ2hhbmRsZXInLFxuICAgICAgICAgICAgdHlwZToge1xuICAgICAgICAgICAgICBpc0Z1bmM6IHRydWUsXG4gICAgICAgICAgICAgIG5hbWU6ICdmdW5jKHcgaHR0cC5SZXNwb25zZVdyaXRlciwgciAqaHR0cC5SZXF1ZXN0KScsXG4gICAgICAgICAgICAgIGFyZ3M6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAndyBodHRwLlJlc3BvbnNlV3JpdGVyJyxcbiAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICd3JyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2h0dHAuUmVzcG9uc2VXcml0ZXInLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdyICpodHRwLlJlcXVlc3QnLFxuICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3InLFxuICAgICAgICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnKmh0dHAuUmVxdWVzdCcsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgcmV0dXJuczogW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdvdGhlcmhhbmRsZXIgZnVuYyh3IGh0dHAuUmVzcG9uc2VXcml0ZXIsIHIgKmh0dHAuUmVxdWVzdCknLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJ290aGVyaGFuZGxlcicsXG4gICAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICAgIGlzRnVuYzogdHJ1ZSxcbiAgICAgICAgICAgICAgbmFtZTogJ2Z1bmModyBodHRwLlJlc3BvbnNlV3JpdGVyLCByICpodHRwLlJlcXVlc3QpJyxcbiAgICAgICAgICAgICAgYXJnczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICd3IGh0dHAuUmVzcG9uc2VXcml0ZXInLFxuICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3cnLFxuICAgICAgICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnaHR0cC5SZXNwb25zZVdyaXRlcicsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbmFtZTogJ3IgKmh0dHAuUmVxdWVzdCcsXG4gICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAncicsXG4gICAgICAgICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICcqaHR0cC5SZXF1ZXN0JywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICByZXR1cm5zOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmV0dXJuczogW11cbiAgICAgIH0pXG5cbiAgICAgIHQoe1xuICAgICAgICBpbnB1dDogJ2Z1bmMoKScsXG4gICAgICAgIGFyZ3M6IFtdLFxuICAgICAgICByZXR1cm5zOiBbXVxuICAgICAgfSlcblxuICAgICAgdCh7XG4gICAgICAgIGlucHV0OiAnZnVuYyh4IGludCkgaW50JyxcbiAgICAgICAgYXJnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd4IGludCcsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAneCcsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdpbnQnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHJldHVybnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnaW50JyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICcnLFxuICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnaW50JywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KVxuXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6ICdmdW5jKGEsIF8gaW50LCB6IGZsb2F0MzIpIGJvb2wnLFxuICAgICAgICBhcmdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2EnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJycsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdhJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnXyBpbnQnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJ18nLFxuICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnaW50JywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAneiBmbG9hdDMyJyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICd6JyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2Zsb2F0MzInLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHJldHVybnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnYm9vbCcsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAnJyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2Jvb2wnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pXG5cbiAgICAgIHQoe1xuICAgICAgICBpbnB1dDogJ2Z1bmMoYSwgYiBpbnQsIHogZmxvYXQzMikgKGJvb2wpJyxcbiAgICAgICAgYXJnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdhJyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICcnLFxuICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnYScsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2IgaW50JyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICdiJyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2ludCcsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3ogZmxvYXQzMicsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAneicsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdmbG9hdDMyJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICByZXR1cm5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2Jvb2wnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJycsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdib29sJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KVxuXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6ICdmdW5jKGEsIGIgaW50LCB6IGZsb2F0NjQsIG9wdCAuLi5pbnRlcmZhY2V7fSkgKHN1Y2Nlc3MgYm9vbCknLFxuICAgICAgICBhcmdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2EnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJycsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdhJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnYiBpbnQnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJ2InLFxuICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnaW50JywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAneiBmbG9hdDY0JyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICd6JyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2Zsb2F0NjQnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdvcHQgLi4uaW50ZXJmYWNle30nLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJ29wdCcsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICcuLi5pbnRlcmZhY2V7fScsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmV0dXJuczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdzdWNjZXNzIGJvb2wnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnYm9vbCcsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSlcblxuICAgICAgdCh7XG4gICAgICAgIGlucHV0OiAnZnVuYyhwcmVmaXggc3RyaW5nLCB2YWx1ZXMgLi4uaW50KScsXG4gICAgICAgIGFyZ3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncHJlZml4IHN0cmluZycsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAncHJlZml4JyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ3N0cmluZycsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3ZhbHVlcyAuLi5pbnQnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJ3ZhbHVlcycsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICcuLi5pbnQnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHJldHVybnM6IFtdXG4gICAgICB9KVxuXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6ICdmdW5jKGludCwgaW50LCBmbG9hdDY0KSAoZmxvYXQ2NCwgKltdaW50KScsXG4gICAgICAgIGFyZ3M6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnaW50JyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICcnLFxuICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnaW50JywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnaW50JyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICcnLFxuICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnaW50JywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnZmxvYXQ2NCcsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAnJyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2Zsb2F0NjQnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHJldHVybnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnZmxvYXQ2NCcsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiAnJyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2Zsb2F0NjQnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICcqW11pbnQnLFxuICAgICAgICAgICAgaWRlbnRpZmllcjogJycsXG4gICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICcqW11pbnQnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pXG5cbiAgICAgIHQoe1xuICAgICAgICBpbnB1dDogJ2Z1bmMobiBpbnQpIGZ1bmMocCAqVCknLFxuICAgICAgICBhcmdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ24gaW50JyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICduJyxcbiAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2ludCcsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmV0dXJuczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdmdW5jKHAgKlQpJyxcbiAgICAgICAgICAgIGlkZW50aWZpZXI6ICcnLFxuICAgICAgICAgICAgdHlwZToge1xuICAgICAgICAgICAgICBpc0Z1bmM6IHRydWUsXG4gICAgICAgICAgICAgIG5hbWU6ICdmdW5jKHAgKlQpJyxcbiAgICAgICAgICAgICAgYXJnczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdwICpUJyxcbiAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdwJyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJypUJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICByZXR1cm5zOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZW5lcmF0ZVNuaXBwZXQnLCAoKSA9PiB7XG4gICAgY29uc3QgdCA9IGNvbnRleHQgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gU3VnZ2VzdGlvbnMuZ2VuZXJhdGVTbmlwcGV0KFxuICAgICAgICB7IHNuaXBDb3VudDogMCwgYXJnQ291bnQ6IDAsIHNuaXBwZXRNb2RlOiAnbmFtZUFuZFR5cGUnIH0sXG4gICAgICAgIGNvbnRleHQuaW5wdXQubmFtZSxcbiAgICAgICAgY29udGV4dC5pbnB1dC50eXBlXG4gICAgICApXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdChyZXN1bHQuZGlzcGxheVRleHQpLnRvRXF1YWwoY29udGV4dC5yZXN1bHQuZGlzcGxheVRleHQpXG4gICAgICBleHBlY3QocmVzdWx0LnNuaXBwZXQpLnRvRXF1YWwoY29udGV4dC5yZXN1bHQuc25pcHBldClcbiAgICB9XG5cbiAgICBpdCgncGFyc2VzIHRoZSBmdW5jdGlvbiBpbnRvIGFyZ3MgYW5kIHJldHVybnMgYXJyYXlzJywgKCkgPT4ge1xuICAgICAgdCh7XG4gICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgbmFtZTogJ1ByaW50JyxcbiAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICBpc0Z1bmM6IHRydWUsXG4gICAgICAgICAgICBuYW1lOiAnZnVuYygpJyxcbiAgICAgICAgICAgIGFyZ3M6IFtdLFxuICAgICAgICAgICAgcmV0dXJuczogW11cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgIHNuaXBwZXQ6ICdQcmludCgpJyxcbiAgICAgICAgICBkaXNwbGF5VGV4dDogJ1ByaW50KCknXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHQoe1xuICAgICAgICBpbnB1dDoge1xuICAgICAgICAgIG5hbWU6ICdQcmludCcsXG4gICAgICAgICAgdHlwZToge1xuICAgICAgICAgICAgaXNGdW5jOiB0cnVlLFxuICAgICAgICAgICAgbmFtZTogJ2Z1bmMoeCBpbnQpIGludCcsXG4gICAgICAgICAgICBhcmdzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAneCBpbnQnLFxuICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICd4JyxcbiAgICAgICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdpbnQnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJldHVybnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdpbnQnLFxuICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICcnLFxuICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2ludCcsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICBzbmlwcGV0OiAnUHJpbnQoJHsxOnggaW50fSknLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlbXBsYXRlLWN1cmx5LWluLXN0cmluZ1xuICAgICAgICAgIGRpc3BsYXlUZXh0OiAnUHJpbnQoeCBpbnQpJ1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6IHtcbiAgICAgICAgICBuYW1lOiAnU2VydmVGdW5jJyxcbiAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICBpc0Z1bmM6IHRydWUsXG4gICAgICAgICAgICBuYW1lOlxuICAgICAgICAgICAgICAnZnVuYyhwYXR0ZXJuIHN0cmluZywgZnVuYyh3IGh0dHAuUmVzcG9uc2VXcml0ZXIsIHIgKmh0dHAuUmVxdWVzdCkpJyxcbiAgICAgICAgICAgIGFyZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdwYXR0ZXJuIHN0cmluZycsXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3BhdHRlcm4nLFxuICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ3N0cmluZycsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2Z1bmModyBodHRwLlJlc3BvbnNlV3JpdGVyLCByICpodHRwLlJlcXVlc3QpJyxcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnJyxcbiAgICAgICAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICAgICAgICBpc0Z1bmM6IHRydWUsXG4gICAgICAgICAgICAgICAgICBuYW1lOiAnZnVuYyh3IGh0dHAuUmVzcG9uc2VXcml0ZXIsIHIgKmh0dHAuUmVxdWVzdCknLFxuICAgICAgICAgICAgICAgICAgYXJnczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3cgaHR0cC5SZXNwb25zZVdyaXRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3cnLFxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2h0dHAuUmVzcG9uc2VXcml0ZXInLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdyICpodHRwLlJlcXVlc3QnLFxuICAgICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdyJyxcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICcqaHR0cC5SZXF1ZXN0JywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICByZXR1cm5zOiBbXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJldHVybnM6IFtdXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICBzbmlwcGV0OlxuICAgICAgICAgICAgJ1NlcnZlRnVuYygkezE6cGF0dGVybiBzdHJpbmd9LCAkezI6ZnVuYygkezM6d30gaHR0cC5SZXNwb25zZVdyaXRlciwgJHs0OnJ9ICpodHRwLlJlcXVlc3QpIHtcXG5cXHQkNVxcblxcXFx9fSknLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlbXBsYXRlLWN1cmx5LWluLXN0cmluZ1xuICAgICAgICAgIGRpc3BsYXlUZXh0OlxuICAgICAgICAgICAgJ1NlcnZlRnVuYyhwYXR0ZXJuIHN0cmluZywgZnVuYyh3IGh0dHAuUmVzcG9uc2VXcml0ZXIsIHIgKmh0dHAuUmVxdWVzdCkpJ1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6IHtcbiAgICAgICAgICBuYW1lOiAnSXQnLFxuICAgICAgICAgIHR5cGU6IHtcbiAgICAgICAgICAgIGlzRnVuYzogdHJ1ZSxcbiAgICAgICAgICAgIG5hbWU6XG4gICAgICAgICAgICAgICdmdW5jKHRleHQgc3RyaW5nLCBib2R5IGludGVyZmFjZXt9LCB0aW1lb3V0IC4uLmZsb2F0NjQpIGJvb2wnLFxuICAgICAgICAgICAgYXJnczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3RleHQgc3RyaW5nJyxcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnc3RyaW5nJywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnYm9keSBpbnRlcmZhY2V7fScsXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2JvZHknLFxuICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2ludGVyZmFjZXt9JywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAndGltZW91dCAuLi5mbG9hdDY0JyxcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAndGltZW91dCcsXG4gICAgICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnLi4uZmxvYXQ2NCcsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmV0dXJuczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2Jvb2wnLFxuICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICcnLFxuICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2Jvb2wnLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgLy8gc25pcHBldDogJ0l0KCR7MTp0ZXh0IHN0cmluZ30sICR7Mjpib2R5IGludGVyZmFjZXtcXFxcfX0sICR7Mzp0aW1lb3V0IC4uLmZsb2F0NjR9KScsXG4gICAgICAgICAgc25pcHBldDogJ0l0KCR7MTp0ZXh0IHN0cmluZ30sICR7Mjpib2R5IGludGVyZmFjZXtcXFxcfX0pJywgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZW1wbGF0ZS1jdXJseS1pbi1zdHJpbmdcbiAgICAgICAgICBkaXNwbGF5VGV4dDogJ0l0KHRleHQgc3RyaW5nLCBib2R5IGludGVyZmFjZXt9LCB0aW1lb3V0IC4uLmZsb2F0NjQpJ1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6IHtcbiAgICAgICAgICBuYW1lOiAnQmxlaCcsXG4gICAgICAgICAgdHlwZToge1xuICAgICAgICAgICAgaXNGdW5jOiB0cnVlLFxuICAgICAgICAgICAgbmFtZTogJ2Z1bmMoZiBmdW5jKCkgaW50ZXJmYWNle30pJyxcbiAgICAgICAgICAgIGFyZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdmIGZ1bmMoKSBpbnRlcmZhY2V7fScsXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2YnLFxuICAgICAgICAgICAgICAgIHR5cGU6IHtcbiAgICAgICAgICAgICAgICAgIGlzRnVuYzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdmdW5jKCkgaW50ZXJmYWNle30nLFxuICAgICAgICAgICAgICAgICAgYXJnczogW10sXG4gICAgICAgICAgICAgICAgICByZXR1cm5zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnaW50ZXJmYWNle30nLFxuICAgICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHsgbmFtZTogJ2ludGVyZmFjZXt9JywgaXNGdW5jOiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZXR1cm5zOiBbXVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgc25pcHBldDogJ0JsZWgoJHsxOmZ1bmMoKSBpbnRlcmZhY2V7XFxcXH0ge1xcblxcdCQyXFxuXFxcXH19KScsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVtcGxhdGUtY3VybHktaW4tc3RyaW5nXG4gICAgICAgICAgZGlzcGxheVRleHQ6ICdCbGVoKGZ1bmMoKSBpbnRlcmZhY2V7fSknXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vIHRoaXMgaXMganVzdCBhIHJpZGljdWxvdXMgZnVuYyB0byB0ZXN0IHRoZSBsaW1pdHMgb2YgdGhlIGZ1bmN0aW9uLi4uXG4gICAgICB0KHtcbiAgICAgICAgaW5wdXQ6IHtcbiAgICAgICAgICBuYW1lOiAnQmxlaCcsXG4gICAgICAgICAgdHlwZToge1xuICAgICAgICAgICAgaXNGdW5jOiB0cnVlLFxuICAgICAgICAgICAgbmFtZTogJ2Z1bmMoZiBmdW5jKGkgaW50ZXJmYWNle30pIGZ1bmMoaW50ZXJmYWNle30pIGludGVyZmFjZXt9KScsXG4gICAgICAgICAgICBhcmdzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnZiBmdW5jKGkgaW50ZXJmYWNle30pIGZ1bmMoaW50ZXJmYWNle30pIGludGVyZmFjZXt9JyxcbiAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnZicsXG4gICAgICAgICAgICAgICAgdHlwZToge1xuICAgICAgICAgICAgICAgICAgaXNGdW5jOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgbmFtZTogJ2Z1bmMoaSBpbnRlcmZhY2V7fSkgZnVuYyhpbnRlcmZhY2V7fSkgaW50ZXJmYWNle30nLFxuICAgICAgICAgICAgICAgICAgYXJnczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2kgaW50ZXJmYWNle30nLFxuICAgICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdpJyxcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB7IG5hbWU6ICdpbnRlcmZhY2V7fScsIGlzRnVuYzogZmFsc2UgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgcmV0dXJuczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2Z1bmMoaW50ZXJmYWNle30pIGludGVyZmFjZXt9JyxcbiAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Z1bmM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZnVuYyhpbnRlcmZhY2V7fSkgaW50ZXJmYWNle30nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2ludGVyZmFjZXt9JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnaScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnaW50ZXJmYWNle30nLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdpbnRlcmZhY2V7fScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogeyBuYW1lOiAnaW50ZXJmYWNle30nLCBpc0Z1bmM6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJldHVybnM6IFtdXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICBzbmlwcGV0OlxuICAgICAgICAgICAgJ0JsZWgoJHsxOmZ1bmMoJHsyOml9IGludGVyZmFjZXtcXFxcfSkgZnVuYyhpbnRlcmZhY2V7XFxcXH0pIGludGVyZmFjZXtcXFxcfSB7XFxuXFx0JDNcXG5cXFxcfX0pJywgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZW1wbGF0ZS1jdXJseS1pbi1zdHJpbmdcbiAgICAgICAgICBkaXNwbGF5VGV4dDogJ0JsZWgoZnVuYyhpIGludGVyZmFjZXt9KSBmdW5jKGludGVyZmFjZXt9KSBpbnRlcmZhY2V7fSknXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAvKlxuICAgICAgZnVuYyh4IGludCkgaW50XG4gICAgICBmdW5jKGEsIF8gaW50LCB6IGZsb2F0MzIpIGJvb2xcbiAgICAgIGZ1bmMoYSwgYiBpbnQsIHogZmxvYXQzMikgKGJvb2wpXG4gICAgICBmdW5jKHByZWZpeCBzdHJpbmcsIHZhbHVlcyAuLi5pbnQpXG4gICAgICBmdW5jKGEsIGIgaW50LCB6IGZsb2F0NjQsIG9wdCAuLi5pbnRlcmZhY2V7fSkgKHN1Y2Nlc3MgYm9vbClcbiAgICAgIGZ1bmMoaW50LCBpbnQsIGZsb2F0NjQpIChmbG9hdDY0LCAqW11pbnQpXG4gICAgICBmdW5jKG4gaW50KSBmdW5jKHAgKlQpXG4gICAgICAqL1xuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2Vuc3VyZU5leHRBcmcnLCAoKSA9PiB7XG4gICAgaXQoJ3BhcnNlcyBwYXJhbXMnLCAoKSA9PiB7XG4gICAgICBsZXQgcmVzdWx0ID0gU3VnZ2VzdGlvbnMuZW5zdXJlTmV4dEFyZyhbJ2YgZnVuYygpIGludCddKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbJ2YgZnVuYygpIGludCddKVxuICAgICAgcmVzdWx0ID0gU3VnZ2VzdGlvbnMuZW5zdXJlTmV4dEFyZyhbJ2YgZnVuYygpIGludCwgcyBzdHJpbmcnXSlcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoWydmIGZ1bmMoKSBpbnQnLCAncyBzdHJpbmcnXSlcbiAgICAgIHJlc3VsdCA9IFN1Z2dlc3Rpb25zLmVuc3VyZU5leHRBcmcoW1xuICAgICAgICAnZiBmdW5jKHMxIHN0cmluZywgaTEgaW50KSBpbnQsIHMgc3RyaW5nJ1xuICAgICAgXSlcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoWydmIGZ1bmMoczEgc3RyaW5nLCBpMSBpbnQpIGludCcsICdzIHN0cmluZyddKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3RvU3VnZ2VzdGlvbicsICgpID0+IHtcbiAgICBjb25zdCB0b1N1Z2dlc3Rpb24gPSAoY2FuZGlkYXRlLCBvID0ge30pID0+IHtcbiAgICAgIHJldHVybiBTdWdnZXN0aW9ucy50b1N1Z2dlc3Rpb24oY2FuZGlkYXRlLCB7XG4gICAgICAgIHByZWZpeDogJycsXG4gICAgICAgIHN1ZmZpeDogJycsXG4gICAgICAgIHNuaXBwZXRNb2RlOiAnbmFtZUFuZFR5cGUnLFxuICAgICAgICAuLi5vXG4gICAgICB9KVxuICAgIH1cblxuICAgIGl0KCdnZW5lcmF0ZXMgc25pcHBldHMnLCAoKSA9PiB7XG4gICAgICBsZXQgcmVzdWx0ID0gdG9TdWdnZXN0aW9uKHtcbiAgICAgICAgY2xhc3M6ICdmdW5jJyxcbiAgICAgICAgbmFtZTogJ0FiYycsXG4gICAgICAgIHR5cGU6ICdmdW5jKGYgZnVuYygpIGludCknXG4gICAgICB9KVxuICAgICAgZXhwZWN0KHJlc3VsdC5kaXNwbGF5VGV4dCkudG9CZSgnQWJjKGZ1bmMoKSBpbnQpJylcbiAgICAgIGV4cGVjdChyZXN1bHQuc25pcHBldCkudG9CZSgnQWJjKCR7MTpmdW5jKCkgaW50IHtcXG5cXHQkMlxcblxcXFx9fSkkMCcpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVtcGxhdGUtY3VybHktaW4tc3RyaW5nXG5cbiAgICAgIHJlc3VsdCA9IHRvU3VnZ2VzdGlvbih7XG4gICAgICAgIGNsYXNzOiAnZnVuYycsXG4gICAgICAgIG5hbWU6ICdBYmMnLFxuICAgICAgICB0eXBlOiAnZnVuYyhmIGZ1bmMoKSBpbnRlcmZhY2V7fSknXG4gICAgICB9KVxuICAgICAgZXhwZWN0KHJlc3VsdC5kaXNwbGF5VGV4dCkudG9CZSgnQWJjKGZ1bmMoKSBpbnRlcmZhY2V7fSknKVxuICAgICAgZXhwZWN0KHJlc3VsdC5zbmlwcGV0KS50b0JlKFxuICAgICAgICAnQWJjKCR7MTpmdW5jKCkgaW50ZXJmYWNle1xcXFx9IHtcXG5cXHQkMlxcblxcXFx9fSkkMCdcbiAgICAgICkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZW1wbGF0ZS1jdXJseS1pbi1zdHJpbmdcblxuICAgICAgcmVzdWx0ID0gdG9TdWdnZXN0aW9uKHtcbiAgICAgICAgY2xhc3M6ICdmdW5jJyxcbiAgICAgICAgbmFtZTogJ0FiYycsXG4gICAgICAgIHR5cGU6ICdmdW5jKGYgZnVuYyhpbnQsIHN0cmluZywgYm9vbCkgaW50ZXJmYWNle30pJ1xuICAgICAgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQuZGlzcGxheVRleHQpLnRvQmUoXG4gICAgICAgICdBYmMoZnVuYyhhcmcxIGludCwgYXJnMiBzdHJpbmcsIGFyZzMgYm9vbCkgaW50ZXJmYWNle30pJ1xuICAgICAgKVxuICAgICAgZXhwZWN0KHJlc3VsdC5zbmlwcGV0KS50b0JlKFxuICAgICAgICAnQWJjKCR7MTpmdW5jKCR7MjphcmcxfSBpbnQsICR7MzphcmcyfSBzdHJpbmcsICR7NDphcmczfSBib29sKSBpbnRlcmZhY2V7XFxcXH0ge1xcblxcdCQ1XFxuXFxcXH19KSQwJyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlbXBsYXRlLWN1cmx5LWluLXN0cmluZ1xuICAgICAgKVxuXG4gICAgICByZXN1bHQgPSB0b1N1Z2dlc3Rpb24oe1xuICAgICAgICBjbGFzczogJ2Z1bmMnLFxuICAgICAgICBuYW1lOiAnQWJjJyxcbiAgICAgICAgdHlwZTogJ2Z1bmMoZiBmdW5jKCkgKGludGVyZmFjZXt9LCBpbnRlcmZhY2V7fSkpJ1xuICAgICAgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQuZGlzcGxheVRleHQpLnRvQmUoJ0FiYyhmdW5jKCkgKGludGVyZmFjZXt9LCBpbnRlcmZhY2V7fSkpJylcbiAgICAgIGV4cGVjdChyZXN1bHQuc25pcHBldCkudG9CZShcbiAgICAgICAgJ0FiYygkezE6ZnVuYygpIChpbnRlcmZhY2V7XFxcXH0sIGludGVyZmFjZXtcXFxcfSkge1xcblxcdCQyXFxuXFxcXH19KSQwJ1xuICAgICAgKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlbXBsYXRlLWN1cmx5LWluLXN0cmluZ1xuXG4gICAgICByZXN1bHQgPSB0b1N1Z2dlc3Rpb24oe1xuICAgICAgICBjbGFzczogJ2Z1bmMnLFxuICAgICAgICBuYW1lOiAnQWJjJyxcbiAgICAgICAgdHlwZTogJ2Z1bmMoZiBpbnRlcmZhY2V7fSknXG4gICAgICB9KVxuICAgICAgZXhwZWN0KHJlc3VsdC5kaXNwbGF5VGV4dCkudG9CZSgnQWJjKGYgaW50ZXJmYWNle30pJylcbiAgICAgIGV4cGVjdChyZXN1bHQuc25pcHBldCkudG9CZSgnQWJjKCR7MTpmIGludGVyZmFjZXtcXFxcfX0pJDAnKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXRlbXBsYXRlLWN1cmx5LWluLXN0cmluZ1xuXG4gICAgICAvLyB0eXBlIEhhbmRsZXJGdW5jIGZ1bmMoaHR0cC5SZXNwb25zZVdyaXRlciwgKmh0dHAuUmVxdWVzdClcbiAgICAgIHJlc3VsdCA9IHRvU3VnZ2VzdGlvbih7XG4gICAgICAgIGNsYXNzOiAndHlwZScsXG4gICAgICAgIG5hbWU6ICdIYW5kbGVyRnVuYycsXG4gICAgICAgIHR5cGU6ICdmdW5jKGh0dHAuUmVzcG9uc2VXcml0ZXIsICpodHRwLlJlcXVlc3QpJ1xuICAgICAgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQuc25pcHBldCkudG9CZShcbiAgICAgICAgJ0hhbmRsZXJGdW5jKGZ1bmMoJHsxOmFyZzF9IGh0dHAuUmVzcG9uc2VXcml0ZXIsICR7MjphcmcyfSAqaHR0cC5SZXF1ZXN0KSB7XFxuXFx0JDNcXG5cXFxcfSkkMCdcbiAgICAgICkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZW1wbGF0ZS1jdXJseS1pbi1zdHJpbmdcbiAgICAgIGV4cGVjdChyZXN1bHQuZGlzcGxheVRleHQpLnRvQmUoJ0hhbmRsZXJGdW5jJylcblxuICAgICAgLy8gdHlwZSBGb29CYXIgZnVuYyhpbnQsIHN0cmluZykgc3RyaW5nXG4gICAgICByZXN1bHQgPSB0b1N1Z2dlc3Rpb24oe1xuICAgICAgICBjbGFzczogJ3R5cGUnLFxuICAgICAgICBuYW1lOiAnRm9vQmFyJyxcbiAgICAgICAgdHlwZTogJ2Z1bmMoaW50LCBzdHJpbmcpIHN0cmluZydcbiAgICAgIH0pXG4gICAgICBleHBlY3QocmVzdWx0LnNuaXBwZXQpLnRvQmUoXG4gICAgICAgICdGb29CYXIoZnVuYygkezE6YXJnMX0gaW50LCAkezI6YXJnMn0gc3RyaW5nKSBzdHJpbmcge1xcblxcdCQzXFxuXFxcXH0pJDAnXG4gICAgICApIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdGVtcGxhdGUtY3VybHktaW4tc3RyaW5nXG4gICAgICBleHBlY3QocmVzdWx0LmRpc3BsYXlUZXh0KS50b0JlKCdGb29CYXInKVxuXG4gICAgICAvLyB0eXBlIEZvb0JhciBmdW5jKGludCwgLi4uc3RyaW5nKSBzdHJpbmdcbiAgICAgIHJlc3VsdCA9IHRvU3VnZ2VzdGlvbih7XG4gICAgICAgIGNsYXNzOiAndHlwZScsXG4gICAgICAgIG5hbWU6ICdGb29CYXInLFxuICAgICAgICB0eXBlOiAnZnVuYyhpbnQsIC4uLnN0cmluZykgc3RyaW5nJ1xuICAgICAgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQuc25pcHBldCkudG9CZShcbiAgICAgICAgJ0Zvb0JhcihmdW5jKCR7MTphcmcxfSBpbnQsICR7MjphcmcyfSAuLi5zdHJpbmcpIHN0cmluZyB7XFxuXFx0JDNcXG5cXFxcfSkkMCdcbiAgICAgICkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby10ZW1wbGF0ZS1jdXJseS1pbi1zdHJpbmdcbiAgICAgIGV4cGVjdChyZXN1bHQuZGlzcGxheVRleHQpLnRvQmUoJ0Zvb0JhcicpXG4gICAgfSlcblxuICAgIGl0KCdkb2VzIG5vdCBhZGQgZnVuY3Rpb24gYXJndW1lbnRzIGZvciAoIHN1ZmZpeCcsICgpID0+IHtcbiAgICAgIGxldCByZXN1bHQgPSB0b1N1Z2dlc3Rpb24oXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzczogJ2Z1bmMnLFxuICAgICAgICAgIG5hbWU6ICdBYmMnLFxuICAgICAgICAgIHR5cGU6ICdmdW5jKGYgZnVuYygpIGludCknXG4gICAgICAgIH0sXG4gICAgICAgIHsgc3VmZml4OiAnKCcgfVxuICAgICAgKVxuICAgICAgZXhwZWN0KHJlc3VsdC50ZXh0KS50b0JlKCdBYmMnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5zbmlwcGV0KS50b0JlRmFsc3koKVxuICAgICAgZXhwZWN0KHJlc3VsdC5kaXNwbGF5VGV4dCkudG9CZUZhbHN5KClcblxuICAgICAgLy8gdHlwZSBGb29CYXIgZnVuYyhpbnQsIHN0cmluZykgc3RyaW5nXG4gICAgICByZXN1bHQgPSB0b1N1Z2dlc3Rpb24oXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzczogJ3R5cGUnLFxuICAgICAgICAgIG5hbWU6ICdGb29CYXInLFxuICAgICAgICAgIHR5cGU6ICdmdW5jKGludCwgc3RyaW5nKSBzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIHsgc3VmZml4OiAnKCcgfVxuICAgICAgKVxuICAgICAgZXhwZWN0KHJlc3VsdC50ZXh0KS50b0JlKCdGb29CYXInKVxuICAgICAgZXhwZWN0KHJlc3VsdC5zbmlwcGV0KS50b0JlRmFsc3koKVxuICAgICAgZXhwZWN0KHJlc3VsdC5kaXNwbGF5VGV4dCkudG9CZUZhbHN5KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==