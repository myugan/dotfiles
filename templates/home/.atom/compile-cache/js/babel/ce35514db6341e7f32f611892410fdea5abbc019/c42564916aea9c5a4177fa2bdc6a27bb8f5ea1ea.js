Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var isVendorSupported = _asyncToGenerator(function* (goconfig) {
  if (vendorSupported != null) {
    return vendorSupported;
  }
  var runtime = yield goconfig.locator.runtime();
  if (!runtime || !runtime.semver) {
    return goconfig.environment()['GO15VENDOREXPERIMENT'] !== '0';
  }

  var _runtime$semver$split$map = runtime.semver.split('.').map(function (v) {
    return parseInt(v, 10);
  });

  var _runtime$semver$split$map2 = _slicedToArray(_runtime$semver$split$map, 2);

  var major = _runtime$semver$split$map2[0];
  var minor = _runtime$semver$split$map2[1];

  switch (major) {
    case 0:
      vendorSupported = false;
      break;
    case 1:
      vendorSupported = minor > 6 || (minor === 5 || minor === 6) && goconfig.environment()['GO15VENDOREXPERIMENT'] !== '0';
      break;
    default:
      vendorSupported = true;
      break;
  }
  return vendorSupported;
});

exports.isVendorSupported = isVendorSupported;
exports.allPackages = allPackages;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var vendorSupported = undefined;

var populatePackages = _asyncToGenerator(function* (pkgs, goconfig) {
  var gopkgs = yield goconfig.locator.findTool('gopkgs');
  if (!gopkgs) return;

  var options = goconfig.executor.getOptions('project');
  var r = yield goconfig.executor.exec(gopkgs, [], options);
  var stderr = r.stderr instanceof Buffer ? r.stderr.toString() : r.stderr;
  if (r.exitcode !== 0) {
    // eslint-disable-next-line no-console
    console.log('go-plus: "gopkgs" returned the following errors:', stderr.trim() || 'exitcode ' + r.exitcode);
  }
  var data = r.stdout instanceof Buffer ? r.stdout.toString() : r.stdout;
  if (!data || !data.trim()) {
    return;
  }
  if (!pkgs) {
    return;
  }

  data.trim().split('\n').forEach(function (path) {
    if (!pkgs) {
      return;
    }
    var name = path.trim().split('/').pop();
    var p = pkgs.get(name) || [];
    pkgs.set(name, p.concat(path.trim()));
  });

  pkgs.forEach(function (p) {
    p.sort();
  });
});

// TODO: make this work for modules
var pkgs = undefined;

function allPackages(goconfig) {
  if (pkgs) {
    return pkgs;
  }
  pkgs = new Map();
  populatePackages(pkgs, goconfig);
  return pkgs;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL2dvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUtzQixpQkFBaUIscUJBQWhDLFdBQWlDLFFBQWtCLEVBQW9CO0FBQzVFLE1BQUksZUFBZSxJQUFJLElBQUksRUFBRTtBQUMzQixXQUFPLGVBQWUsQ0FBQTtHQUN2QjtBQUNELE1BQU0sT0FBTyxHQUFHLE1BQU0sUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNoRCxNQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUMvQixXQUFPLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEdBQUcsQ0FBQTtHQUM5RDs7a0NBQ3NCLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7V0FBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztHQUFBLENBQUM7Ozs7TUFBbkUsS0FBSztNQUFFLEtBQUs7O0FBRW5CLFVBQVEsS0FBSztBQUNYLFNBQUssQ0FBQztBQUNKLHFCQUFlLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLFlBQUs7QUFBQSxBQUNQLFNBQUssQ0FBQztBQUNKLHFCQUFlLEdBQ2IsS0FBSyxHQUFHLENBQUMsSUFDUixDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQSxJQUMxQixRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsc0JBQXNCLENBQUMsS0FBSyxHQUFHLEFBQUMsQ0FBQTtBQUMzRCxZQUFLO0FBQUEsQUFDUDtBQUNFLHFCQUFlLEdBQUcsSUFBSSxDQUFBO0FBQ3RCLFlBQUs7QUFBQSxHQUNSO0FBQ0QsU0FBTyxlQUFlLENBQUE7Q0FDdkI7Ozs7Ozs7QUExQkQsSUFBSSxlQUF5QixZQUFBLENBQUE7O0FBNEI3QixJQUFNLGdCQUFnQixxQkFBRyxXQUN2QixJQUFJLEVBQ0osUUFBUSxFQUNMO0FBQ0gsTUFBTSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUN4RCxNQUFJLENBQUMsTUFBTSxFQUFFLE9BQU07O0FBRW5CLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3ZELE1BQU0sQ0FBQyxHQUFHLE1BQU0sUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUMzRCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxZQUFZLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUE7QUFDMUUsTUFBSSxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsRUFBRTs7QUFFcEIsV0FBTyxDQUFDLEdBQUcsQ0FDVCxrREFBa0QsRUFDbEQsTUFBTSxDQUFDLElBQUksRUFBRSxrQkFBZ0IsQ0FBQyxDQUFDLFFBQVEsQUFBRSxDQUMxQyxDQUFBO0dBQ0Y7QUFDRCxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxZQUFZLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUE7QUFDeEUsTUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRTtBQUN6QixXQUFNO0dBQ1A7QUFDRCxNQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1QsV0FBTTtHQUNQOztBQUVELE1BQUksQ0FDRCxJQUFJLEVBQUUsQ0FDTixLQUFLLENBQUMsSUFBSSxDQUFDLENBQ1gsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ2YsUUFBSSxDQUFDLElBQUksRUFBRTtBQUNULGFBQU07S0FDUDtBQUNELFFBQU0sSUFBSSxHQUFHLElBQUksQ0FDZCxJQUFJLEVBQUUsQ0FDTixLQUFLLENBQUMsR0FBRyxDQUFDLENBQ1YsR0FBRyxFQUFFLENBQUE7QUFDUixRQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUM5QixRQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7R0FDdEMsQ0FBQyxDQUFBOztBQUVKLE1BQUksQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLEVBQUk7QUFDaEIsS0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO0dBQ1QsQ0FBQyxDQUFBO0NBQ0gsQ0FBQSxDQUFBOzs7QUFHRCxJQUFJLElBQTRCLFlBQUEsQ0FBQTs7QUFDekIsU0FBUyxXQUFXLENBQUMsUUFBa0IsRUFBeUI7QUFDckUsTUFBSSxJQUFJLEVBQUU7QUFDUixXQUFPLElBQUksQ0FBQTtHQUNaO0FBQ0QsTUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDaEIsa0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLFNBQU8sSUFBSSxDQUFBO0NBQ1oiLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZ28uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IEdvQ29uZmlnIH0gZnJvbSAnLi9jb25maWcvc2VydmljZSdcblxubGV0IHZlbmRvclN1cHBvcnRlZDogP2Jvb2xlYW5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc1ZlbmRvclN1cHBvcnRlZChnb2NvbmZpZzogR29Db25maWcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgaWYgKHZlbmRvclN1cHBvcnRlZCAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHZlbmRvclN1cHBvcnRlZFxuICB9XG4gIGNvbnN0IHJ1bnRpbWUgPSBhd2FpdCBnb2NvbmZpZy5sb2NhdG9yLnJ1bnRpbWUoKVxuICBpZiAoIXJ1bnRpbWUgfHwgIXJ1bnRpbWUuc2VtdmVyKSB7XG4gICAgcmV0dXJuIGdvY29uZmlnLmVudmlyb25tZW50KClbJ0dPMTVWRU5ET1JFWFBFUklNRU5UJ10gIT09ICcwJ1xuICB9XG4gIGNvbnN0IFttYWpvciwgbWlub3JdID0gcnVudGltZS5zZW12ZXIuc3BsaXQoJy4nKS5tYXAodiA9PiBwYXJzZUludCh2LCAxMCkpXG5cbiAgc3dpdGNoIChtYWpvcikge1xuICAgIGNhc2UgMDpcbiAgICAgIHZlbmRvclN1cHBvcnRlZCA9IGZhbHNlXG4gICAgICBicmVha1xuICAgIGNhc2UgMTpcbiAgICAgIHZlbmRvclN1cHBvcnRlZCA9XG4gICAgICAgIG1pbm9yID4gNiB8fFxuICAgICAgICAoKG1pbm9yID09PSA1IHx8IG1pbm9yID09PSA2KSAmJlxuICAgICAgICAgIGdvY29uZmlnLmVudmlyb25tZW50KClbJ0dPMTVWRU5ET1JFWFBFUklNRU5UJ10gIT09ICcwJylcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHZlbmRvclN1cHBvcnRlZCA9IHRydWVcbiAgICAgIGJyZWFrXG4gIH1cbiAgcmV0dXJuIHZlbmRvclN1cHBvcnRlZFxufVxuXG5jb25zdCBwb3B1bGF0ZVBhY2thZ2VzID0gYXN5bmMgKFxuICBwa2dzOiBNYXA8c3RyaW5nLCBzdHJpbmdbXT4sXG4gIGdvY29uZmlnOiBHb0NvbmZpZ1xuKSA9PiB7XG4gIGNvbnN0IGdvcGtncyA9IGF3YWl0IGdvY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2dvcGtncycpXG4gIGlmICghZ29wa2dzKSByZXR1cm5cblxuICBjb25zdCBvcHRpb25zID0gZ29jb25maWcuZXhlY3V0b3IuZ2V0T3B0aW9ucygncHJvamVjdCcpXG4gIGNvbnN0IHIgPSBhd2FpdCBnb2NvbmZpZy5leGVjdXRvci5leGVjKGdvcGtncywgW10sIG9wdGlvbnMpXG4gIGNvbnN0IHN0ZGVyciA9IHIuc3RkZXJyIGluc3RhbmNlb2YgQnVmZmVyID8gci5zdGRlcnIudG9TdHJpbmcoKSA6IHIuc3RkZXJyXG4gIGlmIChyLmV4aXRjb2RlICE9PSAwKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgICdnby1wbHVzOiBcImdvcGtnc1wiIHJldHVybmVkIHRoZSBmb2xsb3dpbmcgZXJyb3JzOicsXG4gICAgICBzdGRlcnIudHJpbSgpIHx8IGBleGl0Y29kZSAke3IuZXhpdGNvZGV9YFxuICAgIClcbiAgfVxuICBjb25zdCBkYXRhID0gci5zdGRvdXQgaW5zdGFuY2VvZiBCdWZmZXIgPyByLnN0ZG91dC50b1N0cmluZygpIDogci5zdGRvdXRcbiAgaWYgKCFkYXRhIHx8ICFkYXRhLnRyaW0oKSkge1xuICAgIHJldHVyblxuICB9XG4gIGlmICghcGtncykge1xuICAgIHJldHVyblxuICB9XG5cbiAgZGF0YVxuICAgIC50cmltKClcbiAgICAuc3BsaXQoJ1xcbicpXG4gICAgLmZvckVhY2gocGF0aCA9PiB7XG4gICAgICBpZiAoIXBrZ3MpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBuYW1lID0gcGF0aFxuICAgICAgICAudHJpbSgpXG4gICAgICAgIC5zcGxpdCgnLycpXG4gICAgICAgIC5wb3AoKVxuICAgICAgY29uc3QgcCA9IHBrZ3MuZ2V0KG5hbWUpIHx8IFtdXG4gICAgICBwa2dzLnNldChuYW1lLCBwLmNvbmNhdChwYXRoLnRyaW0oKSkpXG4gICAgfSlcblxuICBwa2dzLmZvckVhY2gocCA9PiB7XG4gICAgcC5zb3J0KClcbiAgfSlcbn1cblxuLy8gVE9ETzogbWFrZSB0aGlzIHdvcmsgZm9yIG1vZHVsZXNcbmxldCBwa2dzOiA/TWFwPHN0cmluZywgc3RyaW5nW10+XG5leHBvcnQgZnVuY3Rpb24gYWxsUGFja2FnZXMoZ29jb25maWc6IEdvQ29uZmlnKTogTWFwPHN0cmluZywgc3RyaW5nW10+IHtcbiAgaWYgKHBrZ3MpIHtcbiAgICByZXR1cm4gcGtnc1xuICB9XG4gIHBrZ3MgPSBuZXcgTWFwKClcbiAgcG9wdWxhdGVQYWNrYWdlcyhwa2dzLCBnb2NvbmZpZylcbiAgcmV0dXJuIHBrZ3Ncbn1cbiJdfQ==