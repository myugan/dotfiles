function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/* eslint-env jasmine */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libOutlineOutlineProvider = require('../../lib/outline/outline-provider');

var _libConfigService = require('../../lib/config/service');

var _asyncSpecHelpers = require('../async-spec-helpers');

// eslint-disable-line

'use babel';describe('Outline Provider', function () {
  var editor = undefined;
  var provider = undefined;
  var outline = undefined;

  (0, _asyncSpecHelpers.beforeEach)(_asyncToGenerator(function* () {
    provider = new _libOutlineOutlineProvider.OutlineProvider(new _libConfigService.ConfigService().provide());

    var p = _path2['default'].join(__dirname, '..', 'fixtures', 'outline', 'outline.go');
    editor = yield atom.workspace.open(p);

    outline = yield provider.getOutline(editor);
  }));

  (0, _asyncSpecHelpers.it)('returns an outline', function () {
    expect(outline).toBeDefined();
    expect(outline.outlineTrees).toBeDefined();
    expect(outline.outlineTrees.length).toEqual(1);
  });

  (0, _asyncSpecHelpers.it)('returns the file at the root of the outline', function () {
    var f = outline.outlineTrees[0];
    expect(f.kind).toEqual('file');
    expect(f.plainText).toEqual('main');
    expect(f.representativeName).toEqual('main');
    expect(f.startPosition.row).toEqual(0);
    expect(f.startPosition.column).toEqual(0);
    expect(f.children.length).toEqual(12);
  });

  (0, _asyncSpecHelpers.it)('returns packages for imports', function () {
    var f = outline.outlineTrees[0];
    var packages = f.children.filter(function (o) {
      return o.kind === 'package';
    });
    expect(packages.length).toEqual(2);

    expect(packages[0].plainText).toEqual('"fmt"');
    expect(packages[0].startPosition.row).toEqual(3);
    expect(packages[0].startPosition.column).toEqual(1);
    expect(packages[0].endPosition.row).toEqual(3);
    expect(packages[0].endPosition.column).toEqual(6);

    expect(packages[1].plainText).toEqual('"io"');
    expect(packages[1].startPosition.row).toEqual(4);
    expect(packages[1].startPosition.column).toEqual(1);
    expect(packages[1].endPosition.row).toEqual(4);
    expect(packages[1].endPosition.column).toEqual(5);
  });

  (0, _asyncSpecHelpers.it)('identifies single-line constants', function () {
    var f = outline.outlineTrees[0];
    var consts = f.children.filter(function (o) {
      return o.plainText === 'Answer';
    });
    expect(consts.length).toEqual(1);
    expect(consts[0].kind).toEqual('constant');
  });

  (0, _asyncSpecHelpers.it)('identifies interfaces', function () {
    var f = outline.outlineTrees[0];
    var ifaces = f.children.filter(function (o) {
      return o.kind === 'interface';
    });
    expect(ifaces.length).toEqual(1);
    expect(ifaces[0].plainText).toEqual('Fooer');
    expect(ifaces[0].startPosition.row).toEqual(19);
    expect(ifaces[0].startPosition.column).toEqual(5);
    expect(ifaces[0].endPosition.row).toEqual(21);
    expect(ifaces[0].endPosition.column).toEqual(1);
  });

  (0, _asyncSpecHelpers.it)('identifies methods', function () {
    var f = outline.outlineTrees[0];
    var methods = f.children.filter(function (o) {
      return o.kind === 'method';
    });
    expect(methods.length).toEqual(1);
    expect(methods[0].plainText).toEqual('(Number).ToInt');
  });

  (0, _asyncSpecHelpers.it)('identifies functions', function () {
    var f = outline.outlineTrees[0];
    var funcs = f.children.filter(function (o) {
      return o.kind === 'function';
    });
    expect(funcs.length).toEqual(1);
    expect(funcs[0].plainText).toEqual('Hello');
  });

  (0, _asyncSpecHelpers.it)('identifies structs', function () {
    var f = outline.outlineTrees[0];
    var ss = f.children.filter(function (o) {
      return o.plainText === 'S';
    });
    expect(ss.length).toEqual(1);
    var s = ss[0];
    expect(s.kind).toEqual('class');
  });

  (0, _asyncSpecHelpers.it)('identifies type definitions', function () {
    var f = outline.outlineTrees[0];
    var nums = f.children.filter(function (o) {
      return o.plainText === 'Number';
    });
    expect(nums.length).toEqual(1);

    // TODO: there's no icon for type, so provide a custom icon here..
    expect(nums[0].kind).toEqual('type'); // there's no icon for type
  });

  (0, _asyncSpecHelpers.it)('identifies variables', function () {
    var f = outline.outlineTrees[0];
    var rs = f.children.filter(function (o) {
      return o.plainText === 'r';
    });
    expect(rs.length).toEqual(1);
    expect(rs[0].kind).toEqual('variable');
  });

  (0, _asyncSpecHelpers.it)('identifies constants/enums', function () {
    // go-outline doesn't provide this for us
    var f = outline.outlineTrees[0];
    var items = f.children.filter(function (o) {
      return ['A', 'B', 'C'].includes(o.plainText);
    });
    expect(items.length).toEqual(3);

    // TODO: expect kind to be constant or enum instead
    items.forEach(function (i) {
      return expect(i.kind).toEqual('variable');
    });
  });

  (0, _asyncSpecHelpers.it)('handles multi-byte characters in the input file', function () {
    // TODO ...
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvc3BlYy9vdXRsaW5lL291dGxpbmUtcHJvdmlkZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBR2lCLE1BQU07Ozs7eUNBQ1Msb0NBQW9DOztnQ0FDdEMsMEJBQTBCOztnQ0FDUix1QkFBdUI7Ozs7QUFOdkUsV0FBVyxDQUFBLEFBUVgsUUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDakMsTUFBSSxNQUFNLFlBQUEsQ0FBQTtBQUNWLE1BQUksUUFBUSxZQUFBLENBQUE7QUFDWixNQUFJLE9BQU8sWUFBQSxDQUFBOztBQUVYLHNEQUFXLGFBQVk7QUFDckIsWUFBUSxHQUFHLCtDQUFvQixxQ0FBbUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBOztBQUU3RCxRQUFNLENBQUMsR0FBRyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFBO0FBQ3pFLFVBQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUVyQyxXQUFPLEdBQUcsTUFBTSxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0dBQzVDLEVBQUMsQ0FBQTs7QUFFRiw0QkFBRyxvQkFBb0IsRUFBRSxZQUFNO0FBQzdCLFVBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUM3QixVQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQzFDLFVBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUMvQyxDQUFDLENBQUE7O0FBRUYsNEJBQUcsNkNBQTZDLEVBQUUsWUFBTTtBQUN0RCxRQUFNLENBQUMsR0FBRyxPQUFPLENBQUMs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Q0FBQyxDQUFBOztBQUVGLDRCQUFHLDRCQUE0QixFQUFFLFlBQU07O0FBRXJDLFFBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDakMsUUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO2FBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0tBQUEsQ0FBQyxDQUFBO0FBQzNFLFVBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBOzs7QUFHL0IsU0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7YUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7S0FBQSxDQUFDLENBQUE7R0FDdkQsQ0FBQyxDQUFBOztBQUVGLDRCQUFHLGlEQUFpRCxFQUFFLFlBQU07O0dBRTNELENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9nby1wbHVzL3NwZWMvb3V0bGluZS9vdXRsaW5lLXByb3ZpZGVyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBPdXRsaW5lUHJvdmlkZXIgfSBmcm9tICcuLi8uLi9saWIvb3V0bGluZS9vdXRsaW5lLXByb3ZpZGVyJ1xuaW1wb3J0IHsgQ29uZmlnU2VydmljZSB9IGZyb20gJy4uLy4uL2xpYi9jb25maWcvc2VydmljZSdcbmltcG9ydCB7IGl0LCBmaXQsIGZmaXQsIGJlZm9yZUVhY2gsIHJ1bnMgfSBmcm9tICcuLi9hc3luYy1zcGVjLWhlbHBlcnMnIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuZGVzY3JpYmUoJ091dGxpbmUgUHJvdmlkZXInLCAoKSA9PiB7XG4gIGxldCBlZGl0b3JcbiAgbGV0IHByb3ZpZGVyXG4gIGxldCBvdXRsaW5lXG5cbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgcHJvdmlkZXIgPSBuZXcgT3V0bGluZVByb3ZpZGVyKG5ldyBDb25maWdTZXJ2aWNlKCkucHJvdmlkZSgpKVxuXG4gICAgY29uc3QgcCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdmaXh0dXJlcycsICdvdXRsaW5lJywgJ291dGxpbmUuZ28nKVxuICAgIGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4ocClcblxuICAgIG91dGxpbmUgPSBhd2FpdCBwcm92aWRlci5nZXRPdXRsaW5lKGVkaXRvcilcbiAgfSlcblxuICBpdCgncmV0dXJucyBhbiBvdXRsaW5lJywgKCkgPT4ge1xuICAgIGV4cGVjdChvdXRsaW5lKS50b0JlRGVmaW5lZCgpXG4gICAgZXhwZWN0KG91dGxpbmUub3V0bGluZVRyZWVzKS50b0JlRGVmaW5lZCgpXG4gICAgZXhwZWN0KG91dGxpbmUub3V0bGluZVRyZWVzLmxlbmd0aCkudG9FcXVhbCgxKVxuICB9KVxuXG4gIGl0KCdyZXR1cm5zIHRoZSBmaWxlIGF0IHRoZSByb290IG9mIHRoZSBvdXRsaW5lJywgKCkgPT4ge1xuICAgIGNvbnN0IGYgPSBvdXRsaW5lLm91dGxpbmVUcmVlc1swXVxuICAgIGV4cGVjdChmLmtpbmQpLnRvRXF1YWwoJ2ZpbGUnKVxuICAgIGV4cGVjdChmLnBsYWluVGV4dCkudG9FcXVhbCgnbWFpbicpXG4gICAgZXhwZWN0KGYucmVwcmVzZW50YXRpdmVOYW1lKS50b0VxdWFsKCdtYWluJylcbiAgICBleHBlY3QoZi5zdGFydFBvc2l0aW9uLnJvdykudG9FcXVhbCgwKVxuICAgIGV4cGVjdChmLnN0YXJ0UG9zaXRpb24uY29sdW1uKS50b0VxdWFsKDApXG4gICAgZXhwZWN0KGYuY2hpbGRyZW4ubGVuZ3RoKS50b0VxdWFsKDEyKVxuICB9KVxuXG4gIGl0KCdyZXR1cm5zIHBhY2thZ2VzIGZvciBpbXBvcnRzJywgKCkgPT4ge1xuICAgIGNvbnN0IGYgPSBvdXRsaW5lLm91dGxpbmVUcmVlc1swXVxuICAgIGNvbnN0IHBhY2thZ2VzID0gZi5jaGlsZHJlbi5maWx0ZXIobyA9PiBvLmtpbmQgPT09ICdwYWNrYWdlJylcbiAgICBleHBlY3QocGFja2FnZXMubGVuZ3RoKS50b0VxdWFsKDIpXG5cbiAgICBleHBlY3QocGFja2FnZXNbMF0ucGxhaW5UZXh0KS50b0VxdWFsKCdcImZtdFwiJylcbiAgICBleHBlY3QocGFja2FnZXNbMF0uc3RhcnRQb3NpdGlvbi5yb3cpLnRvRXF1YWwoMylcbiAgICBleHBlY3QocGFja2FnZXNbMF0uc3RhcnRQb3NpdGlvbi5jb2x1bW4pLnRvRXF1YWwoMSlcbiAgICBleHBlY3QocGFja2FnZXNbMF0uZW5kUG9zaXRpb24ucm93KS50b0VxdWFsKDMpXG4gICAgZXhwZWN0KHBhY2thZ2VzWzBdLmVuZFBvc2l0aW9uLmNvbHVtbikudG9FcXVhbCg2KVxuXG4gICAgZXhwZWN0KHBhY2thZ2VzWzFdLnBsYWluVGV4dCkudG9FcXVhbCgnXCJpb1wiJylcbiAgICBleHBlY3QocGFja2FnZXNbMV0uc3RhcnRQb3NpdGlvbi5yb3cpLnRvRXF1YWwoNClcbiAgICBleHBlY3QocGFja2FnZXNbMV0uc3RhcnRQb3NpdGlvbi5jb2x1bW4pLnRvRXF1YWwoMSlcbiAgICBleHBlY3QocGFja2FnZXNbMV0uZW5kUG9zaXRpb24ucm93KS50b0VxdWFsKDQpXG4gICAgZXhwZWN0KHBhY2thZ2VzWzFdLmVuZFBvc2l0aW9uLmNvbHVtbikudG9FcXVhbCg1KVxuICB9KVxuXG4gIGl0KCdpZGVudGlmaWVzIHNpbmdsZS1saW5lIGNvbnN0YW50cycsICgpID0+IHtcbiAgICBjb25zdCBmID0gb3V0bGluZS5vdXRsaW5lVHJlZXNbMF1cbiAgICBjb25zdCBjb25zdHMgPSBmLmNoaWxkcmVuLmZpbHRlcihvID0+IG8ucGxhaW5UZXh0ID09PSAnQW5zd2VyJylcbiAgICBleHBlY3QoY29uc3RzLmxlbmd0aCkudG9FcXVhbCgxKVxuICAgIGV4cGVjdChjb25zdHNbMF0ua2luZCkudG9FcXVhbCgnY29uc3RhbnQnKVxuICB9KVxuXG4gIGl0KCdpZGVudGlmaWVzIGludGVyZmFjZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgZiA9IG91dGxpbmUub3V0bGluZVRyZWVzWzBdXG4gICAgY29uc3QgaWZhY2VzID0gZi5jaGlsZHJlbi5maWx0ZXIobyA9PiBvLmtpbmQgPT09ICdpbnRlcmZhY2UnKVxuICAgIGV4cGVjdChpZmFjZXMubGVuZ3RoKS50b0VxdWFsKDEpXG4gICAgZXhwZWN0KGlmYWNlc1swXS5wbGFpblRleHQpLnRvRXF1YWwoJ0Zvb2VyJylcbiAgICBleHBlY3QoaWZhY2VzWzBdLnN0YXJ0UG9zaXRpb24ucm93KS50b0VxdWFsKDE5KVxuICAgIGV4cGVjdChpZmFjZXNbMF0uc3RhcnRQb3NpdGlvbi5jb2x1bW4pLnRvRXF1YWwoNSlcbiAgICBleHBlY3QoaWZhY2VzWzBdLmVuZFBvc2l0aW9uLnJvdykudG9FcXVhbCgyMSlcbiAgICBleHBlY3QoaWZhY2VzWzBdLmVuZFBvc2l0aW9uLmNvbHVtbikudG9FcXVhbCgxKVxuICB9KVxuXG4gIGl0KCdpZGVudGlmaWVzIG1ldGhvZHMnLCAoKSA9PiB7XG4gICAgY29uc3QgZiA9IG91dGxpbmUub3V0bGluZVRyZWVzWzBdXG4gICAgY29uc3QgbWV0aG9kcyA9IGYuY2hpbGRyZW4uZmlsdGVyKG8gPT4gby5raW5kID09PSAnbWV0aG9kJylcbiAgICBleHBlY3QobWV0aG9kcy5sZW5ndGgpLnRvRXF1YWwoMSlcbiAgICBleHBlY3QobWV0aG9kc1swXS5wbGFpblRleHQpLnRvRXF1YWwoJyhOdW1iZXIpLlRvSW50JylcbiAgfSlcblxuICBpdCgnaWRlbnRpZmllcyBmdW5jdGlvbnMnLCAoKSA9PiB7XG4gICAgY29uc3QgZiA9IG91dGxpbmUub3V0bGluZVRyZWVzWzBdXG4gICAgY29uc3QgZnVuY3MgPSBmLmNoaWxkcmVuLmZpbHRlcihvID0+IG8ua2luZCA9PT0gJ2Z1bmN0aW9uJylcbiAgICBleHBlY3QoZnVuY3MubGVuZ3RoKS50b0VxdWFsKDEpXG4gICAgZXhwZWN0KGZ1bmNzWzBdLnBsYWluVGV4dCkudG9FcXVhbCgnSGVsbG8nKVxuICB9KVxuXG4gIGl0KCdpZGVudGlmaWVzIHN0cnVjdHMnLCAoKSA9PiB7XG4gICAgY29uc3QgZiA9IG91dGxpbmUub3V0bGluZVRyZWVzWzBdXG4gICAgY29uc3Qgc3MgPSBmLmNoaWxkcmVuLmZpbHRlcihvID0+IG8ucGxhaW5UZXh0ID09PSAnUycpXG4gICAgZXhwZWN0KHNzLmxlbmd0aCkudG9FcXVhbCgxKVxuICAgIGNvbnN0IHMgPSBzc1swXVxuICAgIGV4cGVjdChzLmtpbmQpLnRvRXF1YWwoJ2NsYXNzJylcbiAgfSlcblxuICBpdCgnaWRlbnRpZmllcyB0eXBlIGRlZmluaXRpb25zJywgKCkgPT4ge1xuICAgIGNvbnN0IGYgPSBvdXRsaW5lLm91dGxpbmVUcmVlc1swXVxuICAgIGNvbnN0IG51bXMgPSBmLmNoaWxkcmVuLmZpbHRlcihvID0+IG8ucGxhaW5UZXh0ID09PSAnTnVtYmVyJylcbiAgICBleHBlY3QobnVtcy5sZW5ndGgpLnRvRXF1YWwoMSlcblxuICAgIC8vIFRPRE86IHRoZXJlJ3Mgbm8gaWNvbiBmb3IgdHlwZSwgc28gcHJvdmlkZSBhIGN1c3RvbSBpY29uIGhlcmUuLlxuICAgIGV4cGVjdChudW1zWzBdLmtpbmQpLnRvRXF1YWwoJ3R5cGUnKSAvLyB0aGVyZSdzIG5vIGljb24gZm9yIHR5cGVcbiAgfSlcblxuICBpdCgnaWRlbnRpZmllcyB2YXJpYWJsZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgZiA9IG91dGxpbmUub3V0bGluZVRyZWVzWzBdXG4gICAgY29uc3QgcnMgPSBmLmNoaWxkcmVuLmZpbHRlcihvID0+IG8ucGxhaW5UZXh0ID09PSAncicpXG4gICAgZXhwZWN0KHJzLmxlbmd0aCkudG9FcXVhbCgxKVxuICAgIGV4cGVjdChyc1swXS5raW5kKS50b0VxdWFsKCd2YXJpYWJsZScpXG4gIH0pXG5cbiAgaXQoJ2lkZW50aWZpZXMgY29uc3RhbnRzL2VudW1zJywgKCkgPT4ge1xuICAgIC8vIGdvLW91dGxpbmUgZG9lc24ndCBwcm92aWRlIHRoaXMgZm9yIHVzXG4gICAgY29uc3QgZiA9IG91dGxpbmUub3V0bGluZVRyZWVzWzBdXG4gICAgY29uc3QgaXRlbXMgPSBmLmNoaWxkcmVuLmZpbHRlcihvID0+IFsnQScsICdCJywgJ0MnXS5pbmNsdWRlcyhvLnBsYWluVGV4dCkpXG4gICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9FcXVhbCgzKVxuXG4gICAgLy8gVE9ETzogZXhwZWN0IGtpbmQgdG8gYmUgY29uc3RhbnQgb3IgZW51bSBpbnN0ZWFkXG4gICAgaXRlbXMuZm9yRWFjaChpID0+IGV4cGVjdChpLmtpbmQpLnRvRXF1YWwoJ3ZhcmlhYmxlJykpXG4gIH0pXG5cbiAgaXQoJ2hhbmRsZXMgbXVsdGktYnl0ZSBjaGFyYWN0ZXJzIGluIHRoZSBpbnB1dCBmaWxlJywgKCkgPT4ge1xuICAgIC8vIFRPRE8gLi4uXG4gIH0pXG59KVxuIl19