Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getDelve;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _semver = require('semver');

var semver = _interopRequireWildcard(_semver);

'use babel';

var MIN_VERSION = '0.12.0';

function getDelve(goget, goconfig) {
  function assertGOPATH() {
    return !!goconfig.environment().GOPATH;
  }

  function locate() {
    // allow using a custom dlv executable
    var customDlvPath = atom.config.get('go-debug.dlvPath');
    if (customDlvPath) {
      return Promise.resolve(customDlvPath);
    }
    return goconfig.locator.findTool('dlv');
  }

  function located(dlvPath) {
    if (dlvPath) {
      return getVersion(dlvPath).then(update).then(function () {
        return dlvPath;
      });
    }
    return install().then(locate);
  }

  function getVersion(dlvPath) {
    var options = goconfig.executor.getOptions('project');
    return goconfig.executor.exec(dlvPath, ['version'], options).then(function (r) {
      if (r.exitcode !== 0) {
        var message = 'Failed to get version of dlv:\n  ' + ('Exit code: ' + r.exitcode + '\n  ') + ('Error: "' + (r.error && r.error.message || '') + '"\n  ') + ('Stderr: "' + r.stderr + '"\n  ') + ('Stdout: "' + r.stdout + '"\n  ') + ('Dlv path: "' + dlvPath + '"');
        return Promise.reject(new Error(message));
      }
      var prefixVersion = 'Version: ';
      return (r.stdout.split('\n').find(function (l) {
        return l.startsWith(prefixVersion);
      }) || '').substr(prefixVersion.length);
    });
  }

  function install() {
    if (process.platform === 'darwin') {
      // delve is not "go get"-able on OSX yet as it needs to be signed
      atom.notifications.addError('Could not find delve executable "dlv" in your GOPATH!', {
        dismissable: true,
        description: 'Please install it by following the instructions on ' + 'https://github.com/derekparker/delve/blob/master/Documentation/installation/osx/install.md'
      });
      return Promise.reject(new Error('Could not find delve executable "dlv" in your GOPATH!'));
    }

    return goget.get({
      name: 'go-debug',
      packageName: 'dlv',
      packagePath: 'github.com/derekparker/delve/cmd/dlv',
      type: 'missing'
    }).then(function (r) {
      if (r && !r.success) {
        // no notification required here
        return Promise.reject(new Error('Failed to install "dlv" via "go get -u github.com/derekparker/delve/cmd/dlv". ' + 'Please install it manually by following the instructions on ' + 'https://github.com/derekparker/delve/blob/master/Documentation/installation/README.md\n' + r.result.stderr));
      }
    });
  }

  function update(version) {
    if (semver.gte(version, MIN_VERSION)) {
      return Promise.resolve();
    }
    return goget.get({
      name: 'go-debug',
      packageName: 'dlv',
      packagePath: 'github.com/derekparker/delve/cmd/dlv',
      type: 'outdated'
    }).then(function (r) {
      if (r && !r.success) {
        // no notification required here
        return Promise.reject(new Error('Failed to update "dlv" via "go get -u github.com/derekparker/delve/cmd/dlv". ' + 'Please update it manually by following the instructions on ' + 'https://github.com/derekparker/delve/blob/master/Documentation/installation/README.md\n' + r.result.stderr));
      }
    });
  }

  // check if GOPATH is actually available in goconfig!
  if (!assertGOPATH()) {
    atom.notifications.addWarning('The environment variable "GOPATH" is not set!', {
      dismissable: true,
      description: 'Starting atom via a desktop icon might not pass "GOPATH" to atom!\nTry starting atom from the command line instead.'
    });
    return Promise.reject(new Error('Environment variable "GOPATH" is not available!'));
  }

  return locate().then(located);
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi9kZWx2ZS1nZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3FCQU13QixRQUFROzs7O3NCQUpSLFFBQVE7O0lBQXBCLE1BQU07O0FBRmxCLFdBQVcsQ0FBQTs7QUFJWCxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUE7O0FBRWIsU0FBUyxRQUFRLENBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUNqRCxXQUFTLFlBQVksR0FBSTtBQUN2QixXQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFBO0dBQ3ZDOztBQUVELFdBQVMsTUFBTSxHQUFJOztBQUVqQixRQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0FBQ3pELFFBQUksYUFBYSxFQUFFO0FBQ2pCLGFBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtLQUN0QztBQUNELFdBQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDeEM7O0FBRUQsV0FBUyxPQUFPLENBQUUsT0FBTyxFQUFFO0FBQ3pCLFFBQUksT0FBTyxFQUFFO0FBQ1gsYUFBTyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FDWixJQUFJLENBQUM7ZUFBTSxPQUFPO09BQUEsQ0FBQyxDQUFBO0tBQ3ZCO0FBQ0QsV0FBTyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7R0FDOUI7O0FBRUQsV0FBUyxVQUFVLENBQUUsT0FBTyxFQUFFO0FBQzVCLFFBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3ZELFdBQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENB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QUFJO0FBQ2pCLGlCQUFXLEVBQUUscUhBQXFIO0tBQ25JLENBQ0YsQ0FBQTtBQUNELFdBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDLENBQUE7R0FDcEY7O0FBRUQsU0FBTyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7Q0FDOUIiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tZGVidWcvbGliL2RlbHZlLWdldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInXG5cbmNvbnN0IE1JTl9WRVJTSU9OID0gJzAuMTIuMCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RGVsdmUgKGdvZ2V0LCBnb2NvbmZpZykge1xuICBmdW5jdGlvbiBhc3NlcnRHT1BBVEggKCkge1xuICAgIHJldHVybiAhIWdvY29uZmlnLmVudmlyb25tZW50KCkuR09QQVRIXG4gIH1cblxuICBmdW5jdGlvbiBsb2NhdGUgKCkge1xuICAgIC8vIGFsbG93IHVzaW5nIGEgY3VzdG9tIGRsdiBleGVjdXRhYmxlXG4gICAgY29uc3QgY3VzdG9tRGx2UGF0aCA9IGF0b20uY29uZmlnLmdldCgnZ28tZGVidWcuZGx2UGF0aCcpXG4gICAgaWYgKGN1c3RvbURsdlBhdGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoY3VzdG9tRGx2UGF0aClcbiAgICB9XG4gICAgcmV0dXJuIGdvY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2RsdicpXG4gIH1cblxuICBmdW5jdGlvbiBsb2NhdGVkIChkbHZQYXRoKSB7XG4gICAgaWYgKGRsdlBhdGgpIHtcbiAgICAgIHJldHVybiBnZXRWZXJzaW9uKGRsdlBhdGgpXG4gICAgICAgIC50aGVuKHVwZGF0ZSlcbiAgICAgICAgLnRoZW4oKCkgPT4gZGx2UGF0aClcbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbGwoKS50aGVuKGxvY2F0ZSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZlcnNpb24gKGRsdlBhdGgpIHtcbiAgICBjb25zdCBvcHRpb25zID0gZ29jb25maWcuZXhlY3V0b3IuZ2V0T3B0aW9ucygncHJvamVjdCcpXG4gICAgcmV0dXJuIGdvY29uZmlnLmV4ZWN1dG9yLmV4ZWMoZGx2UGF0aCwgWyd2ZXJzaW9uJ10sIG9wdGlvbnMpLnRoZW4oKHIpID0+IHtcbiAgICAgIGlmIChyLmV4aXRjb2RlICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgRmFpbGVkIHRvIGdldCB2ZXJzaW9uIG9mIGRsdjpcXG4gIGAgK1xuICAgICAgICAgIGBFeGl0IGNvZGU6ICR7ci5leGl0Y29kZX1cXG4gIGAgK1xuICAgICAgICAgIGBFcnJvcjogXCIkeyhyLmVycm9yICYmIHIuZXJyb3IubWVzc2FnZSkgfHwgJyd9XCJcXG4gIGAgK1xuICAgICAgICAgIGBTdGRlcnI6IFwiJHtyLnN0ZGVycn1cIlxcbiAgYCArXG4gICAgICAgICAgYFN0ZG91dDogXCIke3Iuc3Rkb3V0fVwiXFxuICBgICtcbiAgICAgICAgICBgRGx2IHBhdGg6IFwiJHtkbHZQYXRofVwiYFxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKG1lc3NhZ2UpKVxuICAgICAgfVxuICAgICAgY29uc3QgcHJlZml4VmVyc2lvbiA9ICdWZXJzaW9uOiAnXG4gICAgICByZXR1cm4gKHIuc3Rkb3V0LnNwbGl0KCdcXG4nKS5maW5kKChsKSA9PiBsLnN0YXJ0c1dpdGgocHJlZml4VmVyc2lvbikpIHx8ICcnKS5zdWJzdHIocHJlZml4VmVyc2lvbi5sZW5ndGgpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc3RhbGwgKCkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJykge1xuICAgICAgLy8gZGVsdmUgaXMgbm90IFwiZ28gZ2V0XCItYWJsZSBvbiBPU1ggeWV0IGFzIGl0IG5lZWRzIHRvIGJlIHNpZ25lZFxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgICAnQ291bGQgbm90IGZpbmQgZGVsdmUgZXhlY3V0YWJsZSBcImRsdlwiIGluIHlvdXIgR09QQVRIIScsXG4gICAgICAgIHtcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1BsZWFzZSBpbnN0YWxsIGl0IGJ5IGZvbGxvd2luZyB0aGUgaW5zdHJ1Y3Rpb25zIG9uICcgK1xuICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vZGVyZWtwYXJrZXIvZGVsdmUvYmxvYi9tYXN0ZXIvRG9jdW1lbnRhdGlvbi9pbnN0YWxsYXRpb24vb3N4L2luc3RhbGwubWQnXG4gICAgICAgIH1cbiAgICAgIClcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIGRlbHZlIGV4ZWN1dGFibGUgXCJkbHZcIiBpbiB5b3VyIEdPUEFUSCEnKSlcbiAgICB9XG5cbiAgICByZXR1cm4gZ29nZXQuZ2V0KHtcbiAgICAgIG5hbWU6ICdnby1kZWJ1ZycsXG4gICAgICBwYWNrYWdlTmFtZTogJ2RsdicsXG4gICAgICBwYWNrYWdlUGF0aDogJ2dpdGh1Yi5jb20vZGVyZWtwYXJrZXIvZGVsdmUvY21kL2RsdicsXG4gICAgICB0eXBlOiAnbWlzc2luZydcbiAgICB9KS50aGVuKChyKSA9PiB7XG4gICAgICBpZiAociAmJiAhci5zdWNjZXNzKSB7XG4gICAgICAgIC8vIG5vIG5vdGlmaWNhdGlvbiByZXF1aXJlZCBoZXJlXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXG4gICAgICAgICAgJ0ZhaWxlZCB0byBpbnN0YWxsIFwiZGx2XCIgdmlhIFwiZ28gZ2V0IC11IGdpdGh1Yi5jb20vZGVyZWtwYXJrZXIvZGVsdmUvY21kL2RsdlwiLiAnICtcbiAgICAgICAgICAnUGxlYXNlIGluc3RhbGwgaXQgbWFudWFsbHkgYnkgZm9sbG93aW5nIHRoZSBpbnN0cnVjdGlvbnMgb24gJyArXG4gICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9kZXJla3Bhcmtlci9kZWx2ZS9ibG9iL21hc3Rlci9Eb2N1bWVudGF0aW9uL2luc3RhbGxhdGlvbi9SRUFETUUubWRcXG4nICsgci5yZXN1bHQuc3RkZXJyXG4gICAgICAgICkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZSAodmVyc2lvbikge1xuICAgIGlmIChzZW12ZXIuZ3RlKHZlcnNpb24sIE1JTl9WRVJTSU9OKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuICAgIHJldHVybiBnb2dldC5nZXQoe1xuICAgICAgbmFtZTogJ2dvLWRlYnVnJyxcbiAgICAgIHBhY2thZ2VOYW1lOiAnZGx2JyxcbiAgICAgIHBhY2thZ2VQYXRoOiAnZ2l0aHViLmNvbS9kZXJla3Bhcmtlci9kZWx2ZS9jbWQvZGx2JyxcbiAgICAgIHR5cGU6ICdvdXRkYXRlZCdcbiAgICB9KS50aGVuKChyKSA9PiB7XG4gICAgICBpZiAociAmJiAhci5zdWNjZXNzKSB7XG4gICAgICAgIC8vIG5vIG5vdGlmaWNhdGlvbiByZXF1aXJlZCBoZXJlXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXG4gICAgICAgICAgJ0ZhaWxlZCB0byB1cGRhdGUgXCJkbHZcIiB2aWEgXCJnbyBnZXQgLXUgZ2l0aHViLmNvbS9kZXJla3Bhcmtlci9kZWx2ZS9jbWQvZGx2XCIuICcgK1xuICAgICAgICAgICdQbGVhc2UgdXBkYXRlIGl0IG1hbnVhbGx5IGJ5IGZvbGxvd2luZyB0aGUgaW5zdHJ1Y3Rpb25zIG9uICcgK1xuICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vZGVyZWtwYXJrZXIvZGVsdmUvYmxvYi9tYXN0ZXIvRG9jdW1lbnRhdGlvbi9pbnN0YWxsYXRpb24vUkVBRE1FLm1kXFxuJyArIHIucmVzdWx0LnN0ZGVyclxuICAgICAgICApKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBjaGVjayBpZiBHT1BBVEggaXMgYWN0dWFsbHkgYXZhaWxhYmxlIGluIGdvY29uZmlnIVxuICBpZiAoIWFzc2VydEdPUEFUSCgpKSB7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAnVGhlIGVudmlyb25tZW50IHZhcmlhYmxlIFwiR09QQVRIXCIgaXMgbm90IHNldCEnLFxuICAgICAge1xuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdTdGFydGluZyBhdG9tIHZpYSBhIGRlc2t0b3AgaWNvbiBtaWdodCBub3QgcGFzcyBcIkdPUEFUSFwiIHRvIGF0b20hXFxuVHJ5IHN0YXJ0aW5nIGF0b20gZnJvbSB0aGUgY29tbWFuZCBsaW5lIGluc3RlYWQuJ1xuICAgICAgfVxuICAgIClcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdFbnZpcm9ubWVudCB2YXJpYWJsZSBcIkdPUEFUSFwiIGlzIG5vdCBhdmFpbGFibGUhJykpXG4gIH1cblxuICByZXR1cm4gbG9jYXRlKCkudGhlbihsb2NhdGVkKVxufVxuIl19