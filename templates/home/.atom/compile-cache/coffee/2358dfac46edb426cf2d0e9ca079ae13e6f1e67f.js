
/*
Global Logger
 */

(function() {
  module.exports = (function() {
    var Emitter, emitter, levels, stream, winston, writable;
    Emitter = require('event-kit').Emitter;
    emitter = new Emitter();
    winston = require('winston');
    stream = require('stream');
    writable = new stream.Writable();
    writable._write = function(chunk, encoding, next) {
      var msg;
      msg = chunk.toString();
      emitter.emit('logging', msg);
      return next();
    };
    levels = {
      silly: 0,
      input: 1,
      verbose: 2,
      prompt: 3,
      debug: 4,
      info: 5,
      data: 6,
      help: 7,
      warn: 8,
      error: 9
    };
    return function(label) {
      var i, len, logger, loggerMethods, method, transport, wlogger;
      transport = new winston.transports.File({
        label: label,
        level: 'debug',
        timestamp: true,
        stream: writable,
        json: false
      });
      wlogger = new winston.Logger({
        transports: [transport]
      });
      wlogger.on('logging', function(transport, level, msg, meta) {
        var d, levelNum, loggerLevel, loggerLevelNum, path, ref;
        loggerLevel = (ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('atom-beautify.general.loggerLevel') : void 0) != null ? ref : "warn";
        loggerLevelNum = levels[loggerLevel];
        levelNum = levels[level];
        if (loggerLevelNum <= levelNum) {
          path = require('path');
          label = "" + (path.dirname(transport.label).split(path.sep).reverse()[0]) + path.sep + (path.basename(transport.label));
          d = new Date();
          return console.log((d.toLocaleDateString()) + " " + (d.toLocaleTimeString()) + " - " + label + " [" + level + "]: " + msg, meta);
        }
      });
      loggerMethods = ['silly', 'debug', 'verbose', 'info', 'warn', 'error'];
      logger = {};
      for (i = 0, len = loggerMethods.length; i < len; i++) {
        method = loggerMethods[i];
        logger[method] = wlogger[method];
      }
      logger.onLogging = function(handler) {
        var subscription;
        subscription = emitter.on('logging', handler);
        return subscription;
      };
      return logger;
    };
  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbG9nZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQW9CLENBQUEsU0FBQTtBQUVsQixRQUFBO0lBQUMsVUFBVyxPQUFBLENBQVEsV0FBUjtJQUNaLE9BQUEsR0FBVSxJQUFJLE9BQUosQ0FBQTtJQUdWLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUjtJQUNWLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjtJQUNULFFBQUEsR0FBVyxJQUFJLE1BQU0sQ0FBQyxRQUFYLENBQUE7SUFDWCxRQUFRLENBQUMsTUFBVCxHQUFrQixTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLElBQWxCO0FBQ2hCLFVBQUE7TUFBQSxHQUFBLEdBQU0sS0FBSyxDQUFDLFFBQU4sQ0FBQTtNQUVOLE9BQU8sQ0FBQyxJQUFSLENBQWEsU0FBYixFQUF3QixHQUF4QjthQUNBLElBQUEsQ0FBQTtJQUpnQjtJQU1sQixNQUFBLEdBQVM7TUFDUCxLQUFBLEVBQU8sQ0FEQTtNQUVQLEtBQUEsRUFBTyxDQUZBO01BR1AsT0FBQSxFQUFTLENBSEY7TUFJUCxNQUFBLEVBQVEsQ0FKRDtNQUtQLEtBQUEsRUFBTyxDQUxBO01BTVAsSUFBQSxFQUFNLENBTkM7TUFPUCxJQUFBLEVBQU0sQ0FQQztNQVFQLElBQUEsRUFBTSxDQVJDO01BU1AsSUFBQSxFQUFNLENBVEM7TUFVUCxLQUFBLEVBQU8sQ0FWQTs7QUFhVCxXQUFPLFNBQUMsS0FBRDtBQUNMLFVBQUE7TUFBQSxTQUFBLEdBQVksSUFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQXhCLENBQThCO1FBQ3hDLEtBQUEsRUFBTyxLQURpQztRQUV4QyxLQUFBLEVBQU8sT0FGaUM7UUFHeEMsU0FBQSxFQUFXLElBSDZCO1FBTXhDLE1BQUEsRUFBUSxRQU5nQztRQU94QyxJQUFBLEVBQU0sS0FQa0M7T0FBOUI7TUFVWixPQUFBLEdBQVUsSUFBSyxPQUFPLENBQUMsTUFBYixDQUFxQjtRQUU3QixVQUFBLEVBQVksQ0FDVixTQURVLENBRmlCO09BQXJCO01BTVYsT0FBTyxDQUFDLEVBQVIsQ0FBVyxTQUFYLEVBQXNCLFNBQUMsU0FBRCxFQUFZLEtBQVosRUFBbUIsR0FBbkIsRUFBd0IsSUFBeEI7QUFDcEIsWUFBQTtRQUFBLFdBQUEsd0lBQ3lDO1FBRXpDLGNBQUEsR0FBaUIsTUFBTyxDQUFBLFdBQUE7UUFDeEIsUUFBQSxHQUFXLE1BQU8sQ0FBQSxLQUFBO1FBQ2xCLElBQUcsY0FBQSxJQUFrQixRQUFyQjtVQUNFLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjtVQUNQLEtBQUEsR0FBUSxFQUFBLEdBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQVMsQ0FBQyxLQUF2QixDQUNDLENBQUMsS0FERixDQUNRLElBQUksQ0FBQyxHQURiLENBQ2lCLENBQUMsT0FEbEIsQ0FBQSxDQUM0QixDQUFBLENBQUEsQ0FEN0IsQ0FBRixHQUVNLElBQUksQ0FBQyxHQUZYLEdBRWdCLENBQUMsSUFBSSxDQUFDLFFBQUwsQ0FBYyxTQUFTLENBQUMsS0FBeEIsQ0FBRDtVQUN4QixDQUFBLEdBQUksSUFBSSxJQUFKLENBQUE7aUJBQ0osT0FBTyxDQUFDLEdBQVIsQ0FBYyxDQUFDLENBQUMsQ0FBQyxrQkFBRixDQUFBLENBQUQsQ0FBQSxHQUF3QixHQUF4QixHQUEwQixDQUFDLENBQUMsQ0FBQyxrQkFBRixDQUFBLENBQUQsQ0FBMUIsR0FBa0QsS0FBbEQsR0FBdUQsS0FBdkQsR0FBNkQsSUFBN0QsR0FBaUUsS0FBakUsR0FBdUUsS0FBdkUsR0FBNEUsR0FBMUYsRUFBaUcsSUFBakcsRUFORjs7TUFOb0IsQ0FBdEI7TUFlQSxhQUFBLEdBQWdCLENBQUMsT0FBRCxFQUFTLE9BQVQsRUFBaUIsU0FBakIsRUFBMkIsTUFBM0IsRUFBa0MsTUFBbEMsRUFBeUMsT0FBekM7TUFDaEIsTUFBQSxHQUFTO0FBQ1QsV0FBQSwrQ0FBQTs7UUFDRSxNQUFPLENBQUEsTUFBQSxDQUFQLEdBQWlCLE9BQVEsQ0FBQSxNQUFBO0FBRDNCO01BR0EsTUFBTSxDQUFDLFNBQVAsR0FBbUIsU0FBQyxPQUFEO0FBRWpCLFlBQUE7UUFBQSxZQUFBLEdBQWUsT0FBTyxDQUFDLEVBQVIsQ0FBVyxTQUFYLEVBQXNCLE9BQXRCO0FBRWYsZUFBTztNQUpVO0FBTW5CLGFBQU87SUEzQ0Y7RUE1QlcsQ0FBQSxDQUFILENBQUE7QUFIakIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbkdsb2JhbCBMb2dnZXJcbiMjI1xubW9kdWxlLmV4cG9ydHMgPSBkbyAtPlxuICAjIENyZWF0ZSBFdmVudCBFbWl0dGVyXG4gIHtFbWl0dGVyfSA9IHJlcXVpcmUgJ2V2ZW50LWtpdCdcbiAgZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgIyBDcmVhdGUgVHJhbnNwb3J0IHdpdGggV3JpdGFibGUgU3RyZWFtXG4gICMgU2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxNTgzODMxLzI1NzgyMDVcbiAgd2luc3RvbiA9IHJlcXVpcmUoJ3dpbnN0b24nKVxuICBzdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKVxuICB3cml0YWJsZSA9IG5ldyBzdHJlYW0uV3JpdGFibGUoKVxuICB3cml0YWJsZS5fd3JpdGUgPSAoY2h1bmssIGVuY29kaW5nLCBuZXh0KSAtPlxuICAgIG1zZyA9IGNodW5rLnRvU3RyaW5nKClcbiAgICAjIGNvbnNvbGUubG9nKG1zZylcbiAgICBlbWl0dGVyLmVtaXQoJ2xvZ2dpbmcnLCBtc2cpXG4gICAgbmV4dCgpXG5cbiAgbGV2ZWxzID0ge1xuICAgIHNpbGx5OiAwLFxuICAgIGlucHV0OiAxLFxuICAgIHZlcmJvc2U6IDIsXG4gICAgcHJvbXB0OiAzLFxuICAgIGRlYnVnOiA0LFxuICAgIGluZm86IDUsXG4gICAgZGF0YTogNixcbiAgICBoZWxwOiA3LFxuICAgIHdhcm46IDgsXG4gICAgZXJyb3I6IDlcbiAgfVxuXG4gIHJldHVybiAobGFiZWwpIC0+XG4gICAgdHJhbnNwb3J0ID0gbmV3ICh3aW5zdG9uLnRyYW5zcG9ydHMuRmlsZSkoe1xuICAgICAgbGFiZWw6IGxhYmVsXG4gICAgICBsZXZlbDogJ2RlYnVnJ1xuICAgICAgdGltZXN0YW1wOiB0cnVlXG4gICAgICAjIHByZXR0eVByaW50OiB0cnVlXG4gICAgICAjIGNvbG9yaXplOiB0cnVlXG4gICAgICBzdHJlYW06IHdyaXRhYmxlXG4gICAgICBqc29uOiBmYWxzZVxuICAgIH0pXG4gICAgIyBJbml0aWFsaXplIGxvZ2dlclxuICAgIHdsb2dnZXIgPSBuZXcgKHdpbnN0b24uTG9nZ2VyKSh7XG4gICAgICAjIENvbmZpZ3VyZSB0cmFuc3BvcnRzXG4gICAgICB0cmFuc3BvcnRzOiBbXG4gICAgICAgIHRyYW5zcG9ydFxuICAgICAgXVxuICAgIH0pXG4gICAgd2xvZ2dlci5vbignbG9nZ2luZycsICh0cmFuc3BvcnQsIGxldmVsLCBtc2csIG1ldGEpLT5cbiAgICAgIGxvZ2dlckxldmVsID0gYXRvbT8uY29uZmlnLmdldChcXFxuICAgICAgICAnYXRvbS1iZWF1dGlmeS5nZW5lcmFsLmxvZ2dlckxldmVsJykgPyBcIndhcm5cIlxuICAgICAgIyBjb25zb2xlLmxvZygnbG9nZ2luZycsIGxvZ2dlckxldmVsLCBhcmd1bWVudHMpXG4gICAgICBsb2dnZXJMZXZlbE51bSA9IGxldmVsc1tsb2dnZXJMZXZlbF1cbiAgICAgIGxldmVsTnVtID0gbGV2ZWxzW2xldmVsXVxuICAgICAgaWYgbG9nZ2VyTGV2ZWxOdW0gPD0gbGV2ZWxOdW1cbiAgICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICBsYWJlbCA9IFwiI3twYXRoLmRpcm5hbWUodHJhbnNwb3J0LmxhYmVsKVxcXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChwYXRoLnNlcCkucmV2ZXJzZSgpWzBdfVxcXG4gICAgICAgICAgICAgICAgICAgICN7cGF0aC5zZXB9I3twYXRoLmJhc2VuYW1lKHRyYW5zcG9ydC5sYWJlbCl9XCJcbiAgICAgICAgZCA9IG5ldyBEYXRlKClcbiAgICAgICAgY29uc29sZS5sb2coXCIje2QudG9Mb2NhbGVEYXRlU3RyaW5nKCl9ICN7ZC50b0xvY2FsZVRpbWVTdHJpbmcoKX0gLSAje2xhYmVsfSBbI3tsZXZlbH1dOiAje21zZ31cIiwgbWV0YSlcbiAgICApXG4gICAgIyBFeHBvcnQgbG9nZ2VyIG1ldGhvZHNcbiAgICBsb2dnZXJNZXRob2RzID0gWydzaWxseScsJ2RlYnVnJywndmVyYm9zZScsJ2luZm8nLCd3YXJuJywnZXJyb3InXVxuICAgIGxvZ2dlciA9IHt9XG4gICAgZm9yIG1ldGhvZCBpbiBsb2dnZXJNZXRob2RzXG4gICAgICBsb2dnZXJbbWV0aG9kXSA9IHdsb2dnZXJbbWV0aG9kXVxuICAgICMgQWRkIGxvZ2dlciBsaXN0ZW5lclxuICAgIGxvZ2dlci5vbkxvZ2dpbmcgPSAoaGFuZGxlcikgLT5cbiAgICAgICMgY29uc29sZS5sb2coJ29uTG9nZ2luZycsIGhhbmRsZXIpXG4gICAgICBzdWJzY3JpcHRpb24gPSBlbWl0dGVyLm9uKCdsb2dnaW5nJywgaGFuZGxlcilcbiAgICAgICMgY29uc29sZS5sb2coJ2VtaXR0ZXInLCBlbWl0dGVyLmhhbmRsZXJzQnlFdmVudE5hbWUsIHN1YnNjcmlwdGlvbilcbiAgICAgIHJldHVybiBzdWJzY3JpcHRpb25cbiAgICAjIFJldHVybiBzaW1wbGlmaWVkIGxvZ2dlclxuICAgIHJldHVybiBsb2dnZXJcbiJdfQ==
