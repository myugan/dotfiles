(function() {
  'use strict';
  var Beautifier, HOST, MULTI_LINE_OUTPUT_TABLE, PORT, PythonBeautifier, format, net,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  net = require('net');

  Beautifier = require('./beautifier');

  HOST = '127.0.0.1';

  PORT = 36805;

  MULTI_LINE_OUTPUT_TABLE = {
    'Grid': 0,
    'Vertical': 1,
    'Hanging Indent': 2,
    'Vertical Hanging Indent': 3,
    'Hanging Grid': 4,
    'Hanging Grid Grouped': 5,
    'NOQA': 6
  };

  format = function(data, formatters) {
    return new Promise(function(resolve, reject) {
      var client;
      client = new net.Socket();
      client.on('error', function(error) {
        client.destroy();
        return reject(error);
      });
      return client.connect(PORT, HOST, function() {
        var response;
        client.setEncoding('utf8');
        client.write(JSON.stringify({
          'data': data,
          'formatters': formatters
        }));
        response = '';
        client.on('data', function(chunk) {
          return response += chunk;
        });
        return client.on('end', function() {
          response = JSON.parse(response);
          if (response.error != null) {
            reject(Error(response.error));
          } else {
            resolve(response.data);
          }
          return client.destroy();
        });
      });
    });
  };

  module.exports = PythonBeautifier = (function(superClass) {
    extend(PythonBeautifier, superClass);

    function PythonBeautifier() {
      return PythonBeautifier.__super__.constructor.apply(this, arguments);
    }

    PythonBeautifier.prototype.name = "pybeautifier";

    PythonBeautifier.prototype.link = "https://github.com/guyskk/pybeautifier";

    PythonBeautifier.prototype.isPreInstalled = false;

    PythonBeautifier.prototype.options = {
      Python: true
    };

    PythonBeautifier.prototype.beautify = function(text, language, options) {
      var formatter, formatters, multi_line_output;
      formatter = {
        'name': options.formatter
      };
      if (options.formatter === 'autopep8') {
        formatter.config = {
          'ignore': options.ignore,
          'max_line_length': options.max_line_length
        };
      } else if (options.formatter === 'yapf') {
        formatter.config = {
          'style_config': options.style_config
        };
      }
      formatters = [formatter];
      if (options.sort_imports) {
        multi_line_output = MULTI_LINE_OUTPUT_TABLE[options.multi_line_output];
        formatters.push({
          'name': 'isort',
          'config': {
            'multi_line_output': multi_line_output
          }
        });
      }
      return new this.Promise(function(resolve, reject) {
        return format(text, formatters).then(function(data) {
          return resolve(data);
        })["catch"](function(error) {
          return reject(error);
        });
      });
    };

    return PythonBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvcHliZWF1dGlmaWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSw4RUFBQTtJQUFBOzs7RUFDQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVI7O0VBQ04sVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLElBQUEsR0FBTzs7RUFDUCxJQUFBLEdBQU87O0VBQ1AsdUJBQUEsR0FBMEI7SUFDeEIsTUFBQSxFQUFRLENBRGdCO0lBRXhCLFVBQUEsRUFBWSxDQUZZO0lBR3hCLGdCQUFBLEVBQWtCLENBSE07SUFJeEIseUJBQUEsRUFBMkIsQ0FKSDtJQUt4QixjQUFBLEVBQWdCLENBTFE7SUFNeEIsc0JBQUEsRUFBd0IsQ0FOQTtJQU94QixNQUFBLEVBQVEsQ0FQZ0I7OztFQVUxQixNQUFBLEdBQVMsU0FBQyxJQUFELEVBQU8sVUFBUDtBQUNQLFdBQU8sSUFBSSxPQUFKLENBQVksU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNqQixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksR0FBRyxDQUFDLE1BQVIsQ0FBQTtNQUNULE1BQU0sQ0FBQyxFQUFQLENBQVUsT0FBVixFQUFtQixTQUFDLEtBQUQ7UUFDakIsTUFBTSxDQUFDLE9BQVAsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxLQUFQO01BRmlCLENBQW5CO2FBR0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxJQUFmLEVBQXFCLElBQXJCLEVBQTJCLFNBQUE7QUFDekIsWUFBQTtRQUFBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLE1BQW5CO1FBQ0EsTUFBTSxDQUFDLEtBQVAsQ0FBYSxJQUFJLENBQUMsU0FBTCxDQUFlO1VBQUMsTUFBQSxFQUFRLElBQVQ7VUFBZSxZQUFBLEVBQWMsVUFBN0I7U0FBZixDQUFiO1FBQ0EsUUFBQSxHQUFXO1FBQ1gsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFWLEVBQWtCLFNBQUMsS0FBRDtpQkFDaEIsUUFBQSxJQUFZO1FBREksQ0FBbEI7ZUFFQSxNQUFNLENBQUMsRUFBUCxDQUFVLEtBQVYsRUFBaUIsU0FBQTtVQUNmLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBTCxDQUFXLFFBQVg7VUFDWCxJQUFHLHNCQUFIO1lBQ0UsTUFBQSxDQUFPLEtBQUEsQ0FBTSxRQUFRLENBQUMsS0FBZixDQUFQLEVBREY7V0FBQSxNQUFBO1lBR0UsT0FBQSxDQUFRLFFBQVEsQ0FBQyxJQUFqQixFQUhGOztpQkFJQSxNQUFNLENBQUMsT0FBUCxDQUFBO1FBTmUsQ0FBakI7TUFOeUIsQ0FBM0I7SUFMaUIsQ0FBWjtFQURBOztFQW9CVCxNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OzsrQkFFckIsSUFBQSxHQUFNOzsrQkFDTixJQUFBLEdBQU07OytCQUNOLGNBQUEsR0FBZ0I7OytCQUVoQixPQUFBLEdBQVM7TUFDUCxNQUFBLEVBQVEsSUFERDs7OytCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTtNQUFBLFNBQUEsR0FBWTtRQUFDLE1BQUEsRUFBUSxPQUFPLENBQUMsU0FBakI7O01BQ1osSUFBRyxPQUFPLENBQUMsU0FBUixLQUFxQixVQUF4QjtRQUNFLFNBQVMsQ0FBQyxNQUFWLEdBQW1CO1VBQ2pCLFFBQUEsRUFBVSxPQUFPLENBQUMsTUFERDtVQUVqQixpQkFBQSxFQUFtQixPQUFPLENBQUMsZUFGVjtVQURyQjtPQUFBLE1BS0ssSUFBRyxPQUFPLENBQUMsU0FBUixLQUFxQixNQUF4QjtRQUNILFNBQVMsQ0FBQyxNQUFWLEdBQW1CO1VBQUMsY0FBQSxFQUFnQixPQUFPLENBQUMsWUFBekI7VUFEaEI7O01BRUwsVUFBQSxHQUFhLENBQUMsU0FBRDtNQUNiLElBQUcsT0FBTyxDQUFDLFlBQVg7UUFDRSxpQkFBQSxHQUFvQix1QkFBd0IsQ0FBQSxPQUFPLENBQUMsaUJBQVI7UUFDNUMsVUFBVSxDQUFDLElBQVgsQ0FDRTtVQUFBLE1BQUEsRUFBUSxPQUFSO1VBQ0EsUUFBQSxFQUFVO1lBQUMsbUJBQUEsRUFBcUIsaUJBQXRCO1dBRFY7U0FERixFQUZGOztBQUtBLGFBQU8sSUFBSSxJQUFDLENBQUEsT0FBTCxDQUFhLFNBQUMsT0FBRCxFQUFVLE1BQVY7ZUFDbEIsTUFBQSxDQUFPLElBQVAsRUFBYSxVQUFiLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2lCQUNKLE9BQUEsQ0FBUSxJQUFSO1FBREksQ0FETixDQUdBLEVBQUMsS0FBRCxFQUhBLENBR08sU0FBQyxLQUFEO2lCQUNMLE1BQUEsQ0FBTyxLQUFQO1FBREssQ0FIUDtNQURrQixDQUFiO0lBZkM7Ozs7S0FWb0M7QUFwQ2hEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5uZXQgPSByZXF1aXJlKCduZXQnKVxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbkhPU1QgPSAnMTI3LjAuMC4xJ1xuUE9SVCA9IDM2ODA1XG5NVUxUSV9MSU5FX09VVFBVVF9UQUJMRSA9IHtcbiAgJ0dyaWQnOiAwLFxuICAnVmVydGljYWwnOiAxLFxuICAnSGFuZ2luZyBJbmRlbnQnOiAyLFxuICAnVmVydGljYWwgSGFuZ2luZyBJbmRlbnQnOiAzLFxuICAnSGFuZ2luZyBHcmlkJzogNCxcbiAgJ0hhbmdpbmcgR3JpZCBHcm91cGVkJzogNSxcbiAgJ05PUUEnOiA2XG59XG5cbmZvcm1hdCA9IChkYXRhLCBmb3JtYXR0ZXJzKSAtPlxuICByZXR1cm4gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICBjbGllbnQgPSBuZXcgbmV0LlNvY2tldCgpXG4gICAgY2xpZW50Lm9uICdlcnJvcicsIChlcnJvcikgLT5cbiAgICAgIGNsaWVudC5kZXN0cm95KClcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICBjbGllbnQuY29ubmVjdCBQT1JULCBIT1NULCAtPlxuICAgICAgY2xpZW50LnNldEVuY29kaW5nKCd1dGY4JylcbiAgICAgIGNsaWVudC53cml0ZShKU09OLnN0cmluZ2lmeSh7J2RhdGEnOiBkYXRhLCAnZm9ybWF0dGVycyc6IGZvcm1hdHRlcnN9KSlcbiAgICAgIHJlc3BvbnNlID0gJydcbiAgICAgIGNsaWVudC5vbiAnZGF0YScsIChjaHVuaykgLT5cbiAgICAgICAgcmVzcG9uc2UgKz0gY2h1bmtcbiAgICAgIGNsaWVudC5vbiAnZW5kJywgLT5cbiAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxuICAgICAgICBpZiByZXNwb25zZS5lcnJvcj9cbiAgICAgICAgICByZWplY3QoRXJyb3IocmVzcG9uc2UuZXJyb3IpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmVzb2x2ZShyZXNwb25zZS5kYXRhKVxuICAgICAgICBjbGllbnQuZGVzdHJveSgpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUHl0aG9uQmVhdXRpZmllciBleHRlbmRzIEJlYXV0aWZpZXJcblxuICBuYW1lOiBcInB5YmVhdXRpZmllclwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2d1eXNray9weWJlYXV0aWZpZXJcIlxuICBpc1ByZUluc3RhbGxlZDogZmFsc2VcblxuICBvcHRpb25zOiB7XG4gICAgUHl0aG9uOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIGZvcm1hdHRlciA9IHsnbmFtZSc6IG9wdGlvbnMuZm9ybWF0dGVyfVxuICAgIGlmIG9wdGlvbnMuZm9ybWF0dGVyID09ICdhdXRvcGVwOCdcbiAgICAgIGZvcm1hdHRlci5jb25maWcgPSB7XG4gICAgICAgICdpZ25vcmUnOiBvcHRpb25zLmlnbm9yZVxuICAgICAgICAnbWF4X2xpbmVfbGVuZ3RoJzogb3B0aW9ucy5tYXhfbGluZV9sZW5ndGhcbiAgICAgIH1cbiAgICBlbHNlIGlmIG9wdGlvbnMuZm9ybWF0dGVyID09ICd5YXBmJ1xuICAgICAgZm9ybWF0dGVyLmNvbmZpZyA9IHsnc3R5bGVfY29uZmlnJzogb3B0aW9ucy5zdHlsZV9jb25maWd9XG4gICAgZm9ybWF0dGVycyA9IFtmb3JtYXR0ZXJdXG4gICAgaWYgb3B0aW9ucy5zb3J0X2ltcG9ydHNcbiAgICAgIG11bHRpX2xpbmVfb3V0cHV0ID0gTVVMVElfTElORV9PVVRQVVRfVEFCTEVbb3B0aW9ucy5tdWx0aV9saW5lX291dHB1dF1cbiAgICAgIGZvcm1hdHRlcnMucHVzaFxuICAgICAgICAnbmFtZSc6ICdpc29ydCdcbiAgICAgICAgJ2NvbmZpZyc6IHsnbXVsdGlfbGluZV9vdXRwdXQnOiBtdWx0aV9saW5lX291dHB1dH1cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBmb3JtYXQodGV4dCwgZm9ybWF0dGVycylcbiAgICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgICByZXNvbHZlKGRhdGEpXG4gICAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgICByZWplY3QoZXJyb3IpXG4iXX0=
