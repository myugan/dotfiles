'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  config: {
    terraformExecutablePath: {
      title: 'Terraform Executable Path',
      type: 'string',
      description: 'Path to Terraform executable (e.g. /usr/local/terraform/bin/terraform) if not in shell env path.',
      'default': 'terraform',
      order: 1
    },
    useTerraformPlan: {
      title: 'Use Terraform Plan',
      description: 'Use \'terraform plan\' instead of \'validate\' for linting (will also display plan errors for directory of current file)',
      type: 'boolean',
      'default': false
    },
    useTerraformFormat: {
      title: 'Use Terraform Fmt',
      description: 'Use \'terraform fmt\' to rewrite all Terraform files in the directory of the current file to a canonical format (occurs before linting).',
      type: 'boolean',
      'default': false
    },
    blacklist: {
      title: 'Exclude Regexp for .tf',
      type: 'string',
      description: 'Regular expression for .tf filenames to ignore (e.g. foo|[bB]ar would ignore afoo.tf and theBar.tf).',
      'default': ''
    },
    globalVarFiles: {
      title: 'Global Var Files',
      type: 'array',
      description: 'Var files specified by absolute paths that should be applied to all projects.',
      'default': [''],
      items: {
        type: 'string'
      }
    },
    localVarFiles: {
      title: 'Local Var Files',
      type: 'array',
      description: 'Var files specified by relative paths to each project that should be applied. If these files are not in the same relative path within each project this will fail.',
      'default': [''],
      items: {
        type: 'string'
      }
    },
    checkRequiredVar: {
      title: 'Check Required Variables',
      type: 'boolean',
      description: 'Check whether all required variables have been specified (unchecking is useful if primarily developing/declaring modules; only works with validate).',
      'default': true
    },
    newVersion: {
      title: 'Terraform >= 0.12 Support',
      type: 'boolean',
      description: 'Your installed version of Terraform is >= 0.12.',
      'default': false
    }
  },

  // activate linter
  activate: function activate() {
    var helpers = require("atom-linter");

    // auto-detect terraform >= 0.12
    helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['validate', '--help']).then(function (output) {
      if (/-json/.exec(output))
        // terraform >= 0.12
        atom.config.set('linter-terraform-syntax.newVersion', true);else {
        // terraform < 0.12
        atom.config.set('linter-terraform-syntax.newVersion', false);

        // check for terraform >= minimum version since it is < 0.12
        helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['destroy', '--help']).then(function (output) {
          if (!/-auto-approve/.exec(output)) {
            atom.notifications.addError('The terraform installed in your path is unsupported.', {
              detail: "Please upgrade your version of Terraform to >= 0.11 or downgrade this package to 1.2.6.\n"
            });
          }
        });
      }
    });
  },

  provideLinter: function provideLinter() {
    return {
      name: 'Terraform',
      grammarScopes: ['source.terraform'],
      scope: 'project',
      lintsOnChange: false,
      lint: function lint(activeEditor) {
        // establish const vars
        var helpers = require('atom-linter');
        var file = process.platform === 'win32' ? activeEditor.getPath().replace(/\\/g, '/') : activeEditor.getPath();
        // try to get file path and handle errors appropriately
        try {
          var dir = require('path').dirname(file);
        } catch (error) {
          // notify on stdin error
          if (/\.dirname/.exec(error.message) != null) {
            atom.notifications.addError('Terraform cannot lint on stdin due to nonexistent pathing on directories. Please save this config to your filesystem.', {
              detail: 'Save this config.'
            });
          }
          // notify on other errors
          else {
              atom.notifications.addError('An error occurred with this package.', {
                detail: error.message
              });
            };
        }

        // bail out if this is on the blacklist
        if (atom.config.get('linter-terraform-syntax.blacklist') !== '') {
          blacklist = new RegExp(atom.config.get('linter-terraform-syntax.blacklist'));
          if (blacklist.exec(file)) return [];
        }

        // regexps for matching syntax errors on output
        var regex_syntax = /Error.*\/(.*\.tf):\sAt\s(\d+):(\d+):\s(.*)/;
        var new_regex_syntax = /Error:.*\/(.*\.tf): (.*:).* at (\d+):(\d+):(.*)/;
        var alt_regex_syntax = /Error:.*\/(.*\.tf): (.*) at (\d+):(\d+):.* at \d+:\d+(: .*)/;
        // regexps for matching non-syntax errors on output
        var dir_error = /\* (.*)/;
        var new_dir_error = /Error: (.*)/;

        // establish args
        var args = atom.config.get('linter-terraform-syntax.useTerraformPlan') ? ['plan'] : ['validate'];
        args.push('-no-color');

        // initialize options with normal defaults
        var options = { cwd: dir, stream: 'stderr', allowEmptyStderr: true };

        // json output for validate if >= 0.12
        if (!atom.config.get('linter-terraform-syntax.useTerraformPlan') && atom.config.get('linter-terraform-syntax.newVersion')) {
          args.push('-json');
          // stdout for json output so also have to ignore exit code
          options = { cwd: dir, ignoreExitCode: true };
        }
        // var inputs are only valid for other than >= 0.12 validate
        else {
            // add global var files
            if (atom.config.get('linter-terraform-syntax.globalVarFiles')[0] != '') for (i = 0; i < atom.config.get('linter-terraform-syntax.globalVarFiles').length; i++) args.push.apply(args, ['-var-file', atom.config.get('linter-terraform-syntax.globalVarFiles')[i]]);

            // add local var files
            if (atom.config.get('linter-terraform-syntax.localVarFiles')[0] != '') for (i = 0; i < atom.config.get('linter-terraform-syntax.localVarFiles').length; i++) args.push.apply(args, ['-var-file', atom.config.get('linter-terraform-syntax.localVarFiles')[i]]);

            // do not check if required variables are specified if desired
            if (!atom.config.get('linter-terraform-syntax.checkRequiredVar') && !atom.config.get('linter-terraform-syntax.useTerraformPlan')) args.push('-check-variables=false');
          }

        // execute terraform fmt if selected
        if (atom.config.get('linter-terraform-syntax.useTerraformFormat')) helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['fmt', '-list=false', dir]);

        return helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), args, options).then(function (output) {
          var toReturn = [];

          // new terraform validate will be doing JSON parsing
          if (!atom.config.get('linter-terraform-syntax.useTerraformPlan') && atom.config.get('linter-terraform-syntax.newVersion')) {
            info = JSON.parse(output);

            // command is reporting an issue
            if (info.valid == false) {
              info.diagnostics.forEach(function (issue) {
                // if no range information given we have to improvise
                var file = dir;
                var line_start = 0;
                var line_end = 0;
                var col_start = 0;
                var col_end = 1;

                // we have range information so use it
                if (issue.range != null) {
                  file = issue.range.filename;
                  line_start = issue.range.start.line - 1;
                  line_end = issue.range.start.column - 1;
                  col_start = issue.range.end.line - 1;
                  col_end = issue.range.end.column;
                }
                // otherwise check if we need to fix dir display
                else if (atom.project.relativizePath(file)[0] == dir) file = dir + ' ';

                toReturn.push({
                  severity: issue.severity,
                  excerpt: issue.summary,
                  description: issue.detail,
                  location: {
                    file: file,
                    position: [[line_start, line_end], [col_start, col_end]]
                  }
                });
              });
            }
          }
          // everything else proceeds as normal
          else {
              output.split(/\r?\n/).forEach(function (line) {
                if (process.platform === 'win32') line = line.replace(/\\/g, '/');

                // matchers for output parsing and capturing
                var matches_syntax = regex_syntax.exec(line);
                var matches_new_syntax = new_regex_syntax.exec(line);
                var matches_alt_syntax = alt_regex_syntax.exec(line);
                var matches_dir = dir_error.exec(line);
                var matches_new_dir = new_dir_error.exec(line);
                // ensure useless block info is not captured and displayed
                var matches_block = /occurred/.exec(line);
                // recognize and display when terraform init would be more helpful
                var matches_init = /error satisfying plugin requirements|terraform init/.exec(line);

                // check for syntax errors in directory
                if (matches_syntax != null) {
                  toReturn.push({
                    severity: 'error',
                    excerpt: matches_syntax[4],
                    location: {
                      file: dir + '/' + matches_syntax[1],
                      position: [[Number.parseInt(matches_syntax[2]) - 1, Number.parseInt(matches_syntax[3]) - 1], [Number.parseInt(matches_syntax[2]) - 1, Number.parseInt(matches_syntax[3])]]
                    }
                  });
                }
                // check for new or alternate format syntax errors in directory (alt first since new also captures alt but botches formatting)
                else if (matches_alt_syntax != null || matches_new_syntax != null) {
                    matches = matches_alt_syntax == null ? matches_new_syntax : matches_alt_syntax;

                    toReturn.push({
                      severity: 'error',
                      excerpt: matches[2] + matches[5],
                      location: {
                        file: dir + '/' + matches[1],
                        position: [[Number.parseInt(matches[3]) - 1, Number.parseInt(matches[4]) - 1], [Number.parseInt(matches[3]) - 1, Number.parseInt(matches[4])]]
                      }
                    });
                  }
                  // check for non-syntax errors in directory and account for changes in newer format
                  else if ((matches_dir != null || matches_new_dir != null) && matches_block == null) {
                      matches = matches_dir == null ? matches_new_dir[1] : matches_dir[1];

                      // dir will be relative after linter processes it, so if dir being linted is the root of the project path, then it will be empty on display
                      // https://atom.io/docs/api/v1.9.4/Project#instance-relativizePath
                      // check if the path to the project dir containing the file is the same as the dir containing the file, meaning the file is in the root dir of the project if true
                      if (atom.project.relativizePath(file)[0] == dir)
                        // i would love to improve this later, especially so it could be above the conditionals
                        dir = dir + ' ';

                      toReturn.push({
                        severity: 'error',
                        excerpt: 'Non-syntax error in directory: ' + matches + '.',
                        location: {
                          file: dir,
                          position: [[0, 0], [0, 1]]
                        }
                      });
                    }
              });
            }
          return toReturn;
        });
      }
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2xpbnRlci10ZXJyYWZvcm0tc3ludGF4L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7cUJBRUc7QUFDYixRQUFNLEVBQUU7QUFDTiwyQkFBdUIsRUFBRTtBQUN2QixXQUFLLEVBQUUsMkJBQTJCO0FBQ2xDLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVcsRUFBRSxrR0FBa0c7QUFDL0csaUJBQVMsV0FBVztBQUNwQixXQUFLLEVBQUUsQ0FBQztLQUNUO0FBQ0Qsb0JBQWdCLEVBQUU7QUFDaEIsV0FBSyxFQUFFLG9CQUFvQjtBQUMzQixpQkFBVyxFQUFFLDBIQUEwSDtBQUN2SSxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7S0FDZjtBQUNELHNCQUFrQixFQUFFO0FBQ2xCLFdBQUssRUFBRSxtQkFBbUI7QUFDMUIsaUJBQVcsRUFBRSwwSUFBMEk7QUFDdkosVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7QUFDRCxhQUFTLEVBQUU7QUFDVCxXQUFLLEVBQUUsd0JBQXdCO0FBQy9CLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVcsRUFBRSxzR0FBc0c7QUFDbkgsaUJBQVMsRUFBRTtLQUNaO0FBQ0Qsa0JBQWMsRUFBRTtBQUNkLFdBQUssRUFBRSxrQkFBa0I7QUFDekIsVUFBSSxFQUFFLE9BQU87QUFDYixpQkFBVyxFQUFFLCtFQUErRTtBQUM1RixpQkFBUyxDQUFDLEVBQUUsQ0FBQztBQUNiLFdBQUssRUFBRTtBQUNMLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRjtBQUNELGlCQUFhLEVBQUU7QUFDYixXQUFLLEVBQUUsaUJBQWlCO0FBQ3hCLFVBQUksRUFBRSxPQUFPO0FBQ2IsaUJBQVcsRUFBRSxvS0FBb0s7QUFDakwsaUJBQVMsQ0FBQyxFQUFFLENBQUM7QUFDYixXQUFLLEVBQUU7QUFDTCxZQUFJLEVBQUUsUUFBUTtPQUNmO0tB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eC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIHRlcnJhZm9ybUV4ZWN1dGFibGVQYXRoOiB7XG4gICAgICB0aXRsZTogJ1RlcnJhZm9ybSBFeGVjdXRhYmxlIFBhdGgnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1BhdGggdG8gVGVycmFmb3JtIGV4ZWN1dGFibGUgKGUuZy4gL3Vzci9sb2NhbC90ZXJyYWZvcm0vYmluL3RlcnJhZm9ybSkgaWYgbm90IGluIHNoZWxsIGVudiBwYXRoLicsXG4gICAgICBkZWZhdWx0OiAndGVycmFmb3JtJyxcbiAgICAgIG9yZGVyOiAxLFxuICAgIH0sXG4gICAgdXNlVGVycmFmb3JtUGxhbjoge1xuICAgICAgdGl0bGU6ICdVc2UgVGVycmFmb3JtIFBsYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdVc2UgXFwndGVycmFmb3JtIHBsYW5cXCcgaW5zdGVhZCBvZiBcXCd2YWxpZGF0ZVxcJyBmb3IgbGludGluZyAod2lsbCBhbHNvIGRpc3BsYXkgcGxhbiBlcnJvcnMgZm9yIGRpcmVjdG9yeSBvZiBjdXJyZW50IGZpbGUpJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgdXNlVGVycmFmb3JtRm9ybWF0OiB7XG4gICAgICB0aXRsZTogJ1VzZSBUZXJyYWZvcm0gRm10JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVXNlIFxcJ3RlcnJhZm9ybSBmbXRcXCcgdG8gcmV3cml0ZSBhbGwgVGVycmFmb3JtIGZpbGVzIGluIHRoZSBkaXJlY3Rvcnkgb2YgdGhlIGN1cnJlbnQgZmlsZSB0byBhIGNhbm9uaWNhbCBmb3JtYXQgKG9jY3VycyBiZWZvcmUgbGludGluZykuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgYmxhY2tsaXN0OiB7XG4gICAgICB0aXRsZTogJ0V4Y2x1ZGUgUmVnZXhwIGZvciAudGYnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1JlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgLnRmIGZpbGVuYW1lcyB0byBpZ25vcmUgKGUuZy4gZm9vfFtiQl1hciB3b3VsZCBpZ25vcmUgYWZvby50ZiBhbmQgdGhlQmFyLnRmKS4nLFxuICAgICAgZGVmYXVsdDogJycsXG4gICAgfSxcbiAgICBnbG9iYWxWYXJGaWxlczoge1xuICAgICAgdGl0bGU6ICdHbG9iYWwgVmFyIEZpbGVzJyxcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1ZhciBmaWxlcyBzcGVjaWZpZWQgYnkgYWJzb2x1dGUgcGF0aHMgdGhhdCBzaG91bGQgYmUgYXBwbGllZCB0byBhbGwgcHJvamVjdHMuJyxcbiAgICAgIGRlZmF1bHQ6IFsnJ10sXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfVxuICAgIH0sXG4gICAgbG9jYWxWYXJGaWxlczoge1xuICAgICAgdGl0bGU6ICdMb2NhbCBWYXIgRmlsZXMnLFxuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVmFyIGZpbGVzIHNwZWNpZmllZCBieSByZWxhdGl2ZSBwYXRocyB0byBlYWNoIHByb2plY3QgdGhhdCBzaG91bGQgYmUgYXBwbGllZC4gSWYgdGhlc2UgZmlsZXMgYXJlIG5vdCBpbiB0aGUgc2FtZSByZWxhdGl2ZSBwYXRoIHdpdGhpbiBlYWNoIHByb2plY3QgdGhpcyB3aWxsIGZhaWwuJyxcbiAgICAgIGRlZmF1bHQ6IFsnJ10sXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tSZXF1aXJlZFZhcjoge1xuICAgICAgdGl0bGU6ICdDaGVjayBSZXF1aXJlZCBWYXJpYWJsZXMnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdDaGVjayB3aGV0aGVyIGFsbCByZXF1aXJlZCB2YXJpYWJsZXMgaGF2ZSBiZWVuIHNwZWNpZmllZCAodW5jaGVja2luZyBpcyB1c2VmdWwgaWYgcHJpbWFyaWx5IGRldmVsb3BpbmcvZGVjbGFyaW5nIG1vZHVsZXM7IG9ubHkgd29ya3Mgd2l0aCB2YWxpZGF0ZSkuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBuZXdWZXJzaW9uOiB7XG4gICAgICB0aXRsZTogJ1RlcnJhZm9ybSA+PSAwLjEyIFN1cHBvcnQnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdZb3VyIGluc3RhbGxlZCB2ZXJzaW9uIG9mIFRlcnJhZm9ybSBpcyA+PSAwLjEyLicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9XG4gIH0sXG5cbiAgLy8gYWN0aXZhdGUgbGludGVyXG4gIGFjdGl2YXRlKCkge1xuICAgIGNvbnN0IGhlbHBlcnMgPSByZXF1aXJlKFwiYXRvbS1saW50ZXJcIik7XG5cbiAgICAvLyBhdXRvLWRldGVjdCB0ZXJyYWZvcm0gPj0gMC4xMlxuICAgIGhlbHBlcnMuZXhlYyhhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci10ZXJyYWZvcm0tc3ludGF4LnRlcnJhZm9ybUV4ZWN1dGFibGVQYXRoJyksIFsndmFsaWRhdGUnLCAnLS1oZWxwJ10pLnRoZW4ob3V0cHV0ID0+IHtcbiAgICAgIGlmICgvLWpzb24vLmV4ZWMob3V0cHV0KSlcbiAgICAgICAgLy8gdGVycmFmb3JtID49IDAuMTJcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdGVycmFmb3JtLXN5bnRheC5uZXdWZXJzaW9uJywgdHJ1ZSlcbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyB0ZXJyYWZvcm0gPCAwLjEyXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXRlcnJhZm9ybS1zeW50YXgubmV3VmVyc2lvbicsIGZhbHNlKVxuXG4gICAgICAgIC8vIGNoZWNrIGZvciB0ZXJyYWZvcm0gPj0gbWluaW11bSB2ZXJzaW9uIHNpbmNlIGl0IGlzIDwgMC4xMlxuICAgICAgICBoZWxwZXJzLmV4ZWMoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdGVycmFmb3JtLXN5bnRheC50ZXJyYWZvcm1FeGVjdXRhYmxlUGF0aCcpLCBbJ2Rlc3Ryb3knLCAnLS1oZWxwJ10pLnRoZW4ob3V0cHV0ID0+IHtcbiAgICAgICAgICBpZiAoISgvLWF1dG8tYXBwcm92ZS8uZXhlYyhvdXRwdXQpKSkge1xuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgICAgICAgICAnVGhlIHRlcnJhZm9ybSBpbnN0YWxsZWQgaW4geW91ciBwYXRoIGlzIHVuc3VwcG9ydGVkLicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6IFwiUGxlYXNlIHVwZ3JhZGUgeW91ciB2ZXJzaW9uIG9mIFRlcnJhZm9ybSB0byA+PSAwLjExIG9yIGRvd25ncmFkZSB0aGlzIHBhY2thZ2UgdG8gMS4yLjYuXFxuXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdUZXJyYWZvcm0nLFxuICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UudGVycmFmb3JtJ10sXG4gICAgICBzY29wZTogJ3Byb2plY3QnLFxuICAgICAgbGludHNPbkNoYW5nZTogZmFsc2UsXG4gICAgICBsaW50OiAoYWN0aXZlRWRpdG9yKSA9PiB7XG4gICAgICAgIC8vIGVzdGFibGlzaCBjb25zdCB2YXJzXG4gICAgICAgIGNvbnN0IGhlbHBlcnMgPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpO1xuICAgICAgICBjb25zdCBmaWxlID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/IGFjdGl2ZUVkaXRvci5nZXRQYXRoKCkucmVwbGFjZSgvXFxcXC9nLCAnLycpIDogYWN0aXZlRWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgLy8gdHJ5IHRvIGdldCBmaWxlIHBhdGggYW5kIGhhbmRsZSBlcnJvcnMgYXBwcm9wcmlhdGVseVxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBkaXIgPSByZXF1aXJlKCdwYXRoJykuZGlybmFtZShmaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlcnJvcikge1xuICAgICAgICAgIC8vIG5vdGlmeSBvbiBzdGRpbiBlcnJvclxuICAgICAgICAgIGlmICgvXFwuZGlybmFtZS8uZXhlYyhlcnJvci5tZXNzYWdlKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAgICAgICAgICdUZXJyYWZvcm0gY2Fubm90IGxpbnQgb24gc3RkaW4gZHVlIHRvIG5vbmV4aXN0ZW50IHBhdGhpbmcgb24gZGlyZWN0b3JpZXMuIFBsZWFzZSBzYXZlIHRoaXMgY29uZmlnIHRvIHlvdXIgZmlsZXN5c3RlbS4nLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiAnU2F2ZSB0aGlzIGNvbmZpZy4nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG5vdGlmeSBvbiBvdGhlciBlcnJvcnNcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgICAgICAgJ0FuIGVycm9yIG9jY3VycmVkIHdpdGggdGhpcyBwYWNrYWdlLicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6IGVycm9yLm1lc3NhZ2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYmFpbCBvdXQgaWYgdGhpcyBpcyBvbiB0aGUgYmxhY2tsaXN0XG4gICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci10ZXJyYWZvcm0tc3ludGF4LmJsYWNrbGlzdCcpICE9PSAnJykge1xuICAgICAgICAgIGJsYWNrbGlzdCA9IG5ldyBSZWdFeHAoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdGVycmFmb3JtLXN5bnRheC5ibGFja2xpc3QnKSlcbiAgICAgICAgICBpZiAoYmxhY2tsaXN0LmV4ZWMoZmlsZSkpXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWdleHBzIGZvciBtYXRjaGluZyBzeW50YXggZXJyb3JzIG9uIG91dHB1dFxuICAgICAgICBjb25zdCByZWdleF9zeW50YXggPSAvRXJyb3IuKlxcLyguKlxcLnRmKTpcXHNBdFxccyhcXGQrKTooXFxkKyk6XFxzKC4qKS87XG4gICAgICAgIGNvbnN0IG5ld19yZWdleF9zeW50YXggPSAvRXJyb3I6LipcXC8oLipcXC50Zik6ICguKjopLiogYXQgKFxcZCspOihcXGQrKTooLiopLztcbiAgICAgICAgY29uc3QgYWx0X3JlZ2V4X3N5bnRheCA9IC9FcnJvcjouKlxcLyguKlxcLnRmKTogKC4qKSBhdCAoXFxkKyk6KFxcZCspOi4qIGF0IFxcZCs6XFxkKyg6IC4qKS87XG4gICAgICAgIC8vIHJlZ2V4cHMgZm9yIG1hdGNoaW5nIG5vbi1zeW50YXggZXJyb3JzIG9uIG91dHB1dFxuICAgICAgICBjb25zdCBkaXJfZXJyb3IgPSAvXFwqICguKikvO1xuICAgICAgICBjb25zdCBuZXdfZGlyX2Vycm9yID0gL0Vycm9yOiAoLiopLztcblxuICAgICAgICAvLyBlc3RhYmxpc2ggYXJnc1xuICAgICAgICB2YXIgYXJncyA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLXRlcnJhZm9ybS1zeW50YXgudXNlVGVycmFmb3JtUGxhbicpID8gWydwbGFuJ10gOiBbJ3ZhbGlkYXRlJ107XG4gICAgICAgIGFyZ3MucHVzaCgnLW5vLWNvbG9yJyk7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBvcHRpb25zIHdpdGggbm9ybWFsIGRlZmF1bHRzXG4gICAgICAgIHZhciBvcHRpb25zID0geyBjd2Q6IGRpciwgc3RyZWFtOiAnc3RkZXJyJywgYWxsb3dFbXB0eVN0ZGVycjogdHJ1ZSB9XG5cbiAgICAgICAgLy8ganNvbiBvdXRwdXQgZm9yIHZhbGlkYXRlIGlmID49IDAuMTJcbiAgICAgICAgaWYgKCEoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdGVycmFmb3JtLXN5bnRheC51c2VUZXJyYWZvcm1QbGFuJykpICYmIGF0b20uY29uZmlnLmdldCgnbGludGVyLXRlcnJhZm9ybS1zeW50YXgubmV3VmVyc2lvbicpKSB7XG4gICAgICAgICAgYXJncy5wdXNoKCctanNvbicpXG4gICAgICAgICAgLy8gc3Rkb3V0IGZvciBqc29uIG91dHB1dCBzbyBhbHNvIGhhdmUgdG8gaWdub3JlIGV4aXQgY29kZVxuICAgICAgICAgIG9wdGlvbnMgPSB7IGN3ZDogZGlyLCBpZ25vcmVFeGl0Q29kZTogdHJ1ZSB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdmFyIGlucHV0cyBhcmUgb25seSB2YWxpZCBmb3Igb3RoZXIgdGhhbiA+PSAwLjEyIHZhbGlkYXRlXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIC8vIGFkZCBnbG9iYWwgdmFyIGZpbGVzXG4gICAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnbGludGVyLXRlcnJhZm9ybS1zeW50YXguZ2xvYmFsVmFyRmlsZXMnKVswXSAhPSAnJylcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci10ZXJyYWZvcm0tc3ludGF4Lmdsb2JhbFZhckZpbGVzJykubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgIGFyZ3MucHVzaCguLi5bJy12YXItZmlsZScsIGF0b20uY29uZmlnLmdldCgnbGludGVyLXRlcnJhZm9ybS1zeW50YXguZ2xvYmFsVmFyRmlsZXMnKVtpXV0pO1xuXG4gICAgICAgICAgLy8gYWRkIGxvY2FsIHZhciBmaWxlc1xuICAgICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci10ZXJyYWZvcm0tc3ludGF4LmxvY2FsVmFyRmlsZXMnKVswXSAhPSAnJylcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci10ZXJyYWZvcm0tc3ludGF4LmxvY2FsVmFyRmlsZXMnKS5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgYXJncy5wdXNoKC4uLlsnLXZhci1maWxlJywgYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdGVycmFmb3JtLXN5bnRheC5sb2NhbFZhckZpbGVzJylbaV1dKTtcblxuICAgICAgICAgIC8vIGRvIG5vdCBjaGVjayBpZiByZXF1aXJlZCB2YXJpYWJsZXMgYXJlIHNwZWNpZmllZCBpZiBkZXNpcmVkXG4gICAgICAgICAgaWYgKCEoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdGVycmFmb3JtLXN5bnRheC5jaGVja1JlcXVpcmVkVmFyJykpICYmICEoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdGVycmFmb3JtLXN5bnRheC51c2VUZXJyYWZvcm1QbGFuJykpKVxuICAgICAgICAgICAgYXJncy5wdXNoKCctY2hlY2stdmFyaWFibGVzPWZhbHNlJylcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGV4ZWN1dGUgdGVycmFmb3JtIGZtdCBpZiBzZWxlY3RlZFxuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdGVycmFmb3JtLXN5bnRheC51c2VUZXJyYWZvcm1Gb3JtYXQnKSlcbiAgICAgICAgICBoZWxwZXJzLmV4ZWMoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdGVycmFmb3JtLXN5bnRheC50ZXJyYWZvcm1FeGVjdXRhYmxlUGF0aCcpLCBbJ2ZtdCcsICctbGlzdD1mYWxzZScsIGRpcl0pXG5cbiAgICAgICAgcmV0dXJuIGhlbHBlcnMuZXhlYyhhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci10ZXJyYWZvcm0tc3ludGF4LnRlcnJhZm9ybUV4ZWN1dGFibGVQYXRoJyksIGFyZ3MsIG9wdGlvbnMpLnRoZW4ob3V0cHV0ID0+IHtcbiAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBbXTtcblxuICAgICAgICAgIC8vIG5ldyB0ZXJyYWZvcm0gdmFsaWRhdGUgd2lsbCBiZSBkb2luZyBKU09OIHBhcnNpbmdcbiAgICAgICAgICBpZiAoIShhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci10ZXJyYWZvcm0tc3ludGF4LnVzZVRlcnJhZm9ybVBsYW4nKSkgJiYgYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdGVycmFmb3JtLXN5bnRheC5uZXdWZXJzaW9uJykpIHtcbiAgICAgICAgICAgIGluZm8gPSBKU09OLnBhcnNlKG91dHB1dClcblxuICAgICAgICAgICAgLy8gY29tbWFuZCBpcyByZXBvcnRpbmcgYW4gaXNzdWVcbiAgICAgICAgICAgIGlmIChpbmZvLnZhbGlkID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIGluZm8uZGlhZ25vc3RpY3MuZm9yRWFjaChmdW5jdGlvbiAoaXNzdWUpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBubyByYW5nZSBpbmZvcm1hdGlvbiBnaXZlbiB3ZSBoYXZlIHRvIGltcHJvdmlzZVxuICAgICAgICAgICAgICAgIHZhciBmaWxlID0gZGlyO1xuICAgICAgICAgICAgICAgIHZhciBsaW5lX3N0YXJ0ID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgbGluZV9lbmQgPSAwO1xuICAgICAgICAgICAgICAgIHZhciBjb2xfc3RhcnQgPSAwO1xuICAgICAgICAgICAgICAgIHZhciBjb2xfZW5kID0gMTtcblxuICAgICAgICAgICAgICAgIC8vIHdlIGhhdmUgcmFuZ2UgaW5mb3JtYXRpb24gc28gdXNlIGl0XG4gICAgICAgICAgICAgICAgaWYgKGlzc3VlLnJhbmdlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGZpbGUgPSBpc3N1ZS5yYW5nZS5maWxlbmFtZTtcbiAgICAgICAgICAgICAgICAgIGxpbmVfc3RhcnQgPSBpc3N1ZS5yYW5nZS5zdGFydC5saW5lIC0gMTtcbiAgICAgICAgICAgICAgICAgIGxpbmVfZW5kID0gaXNzdWUucmFuZ2Uuc3RhcnQuY29sdW1uIC0gMTtcbiAgICAgICAgICAgICAgICAgIGNvbF9zdGFydCA9IGlzc3VlLnJhbmdlLmVuZC5saW5lIC0gMTtcbiAgICAgICAgICAgICAgICAgIGNvbF9lbmQgPSBpc3N1ZS5yYW5nZS5lbmQuY29sdW1uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UgY2hlY2sgaWYgd2UgbmVlZCB0byBmaXggZGlyIGRpc3BsYXlcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZSlbMF0gPT0gZGlyKVxuICAgICAgICAgICAgICAgICAgZmlsZSA9IGRpciArICcgJ1xuXG4gICAgICAgICAgICAgICAgdG9SZXR1cm4ucHVzaCh7XG4gICAgICAgICAgICAgICAgICBzZXZlcml0eTogaXNzdWUuc2V2ZXJpdHksXG4gICAgICAgICAgICAgICAgICBleGNlcnB0OiBpc3N1ZS5zdW1tYXJ5LFxuICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGlzc3VlLmRldGFpbCxcbiAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBbW2xpbmVfc3RhcnQsIGxpbmVfZW5kXSwgW2NvbF9zdGFydCwgY29sX2VuZF1dLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGV2ZXJ5dGhpbmcgZWxzZSBwcm9jZWVkcyBhcyBub3JtYWxcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG91dHB1dC5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpXG4gICAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxcXC9nLCAnLycpXG5cbiAgICAgICAgICAgICAgLy8gbWF0Y2hlcnMgZm9yIG91dHB1dCBwYXJzaW5nIGFuZCBjYXB0dXJpbmdcbiAgICAgICAgICAgICAgY29uc3QgbWF0Y2hlc19zeW50YXggPSByZWdleF9zeW50YXguZXhlYyhsaW5lKTtcbiAgICAgICAgICAgICAgY29uc3QgbWF0Y2hlc19uZXdfc3ludGF4ID0gbmV3X3JlZ2V4X3N5bnRheC5leGVjKGxpbmUpO1xuICAgICAgICAgICAgICBjb25zdCBtYXRjaGVzX2FsdF9zeW50YXggPSBhbHRfcmVnZXhfc3ludGF4LmV4ZWMobGluZSk7XG4gICAgICAgICAgICAgIGNvbnN0IG1hdGNoZXNfZGlyID0gZGlyX2Vycm9yLmV4ZWMobGluZSk7XG4gICAgICAgICAgICAgIGNvbnN0IG1hdGNoZXNfbmV3X2RpciA9IG5ld19kaXJfZXJyb3IuZXhlYyhsaW5lKTtcbiAgICAgICAgICAgICAgLy8gZW5zdXJlIHVzZWxlc3MgYmxvY2sgaW5mbyBpcyBub3QgY2FwdHVyZWQgYW5kIGRpc3BsYXllZFxuICAgICAgICAgICAgICBjb25zdCBtYXRjaGVzX2Jsb2NrID0gL29jY3VycmVkLy5leGVjKGxpbmUpO1xuICAgICAgICAgICAgICAvLyByZWNvZ25pemUgYW5kIGRpc3BsYXkgd2hlbiB0ZXJyYWZvcm0gaW5pdCB3b3VsZCBiZSBtb3JlIGhlbHBmdWxcbiAgICAgICAgICAgICAgY29uc3QgbWF0Y2hlc19pbml0ID0gL2Vycm9yIHNhdGlzZnlpbmcgcGx1Z2luIHJlcXVpcmVtZW50c3x0ZXJyYWZvcm0gaW5pdC8uZXhlYyhsaW5lKVxuXG4gICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBzeW50YXggZXJyb3JzIGluIGRpcmVjdG9yeVxuICAgICAgICAgICAgICBpZiAobWF0Y2hlc19zeW50YXggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRvUmV0dXJuLnB1c2goe1xuICAgICAgICAgICAgICAgICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICBleGNlcnB0OiBtYXRjaGVzX3N5bnRheFs0XSxcbiAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGU6IGRpciArICcvJyArIG1hdGNoZXNfc3ludGF4WzFdLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogW1tOdW1iZXIucGFyc2VJbnQobWF0Y2hlc19zeW50YXhbMl0pIC0gMSwgTnVtYmVyLnBhcnNlSW50KG1hdGNoZXNfc3ludGF4WzNdKSAtIDFdLCBbTnVtYmVyLnBhcnNlSW50KG1hdGNoZXNfc3ludGF4WzJdKSAtIDEsIE51bWJlci5wYXJzZUludChtYXRjaGVzX3N5bnRheFszXSldXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIG5ldyBvciBhbHRlcm5hdGUgZm9ybWF0IHN5bnRheCBlcnJvcnMgaW4gZGlyZWN0b3J5IChhbHQgZmlyc3Qgc2luY2UgbmV3IGFsc28gY2FwdHVyZXMgYWx0IGJ1dCBib3RjaGVzIGZvcm1hdHRpbmcpXG4gICAgICAgICAgICAgIGVsc2UgaWYgKChtYXRjaGVzX2FsdF9zeW50YXggIT0gbnVsbCkgfHwgKG1hdGNoZXNfbmV3X3N5bnRheCAhPSBudWxsKSkge1xuICAgICAgICAgICAgICAgIG1hdGNoZXMgPSBtYXRjaGVzX2FsdF9zeW50YXggPT0gbnVsbCA/IG1hdGNoZXNfbmV3X3N5bnRheCA6IG1hdGNoZXNfYWx0X3N5bnRheDtcblxuICAgICAgICAgICAgICAgIHRvUmV0dXJuLnB1c2goe1xuICAgICAgICAgICAgICAgICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICBleGNlcnB0OiBtYXRjaGVzWzJdICsgbWF0Y2hlc1s1XSxcbiAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGU6IGRpciArICcvJyArIG1hdGNoZXNbMV0sXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBbW051bWJlci5wYXJzZUludChtYXRjaGVzWzNdKSAtIDEsIE51bWJlci5wYXJzZUludChtYXRjaGVzWzRdKSAtIDFdLCBbTnVtYmVyLnBhcnNlSW50KG1hdGNoZXNbM10pIC0gMSwgTnVtYmVyLnBhcnNlSW50KG1hdGNoZXNbNF0pXV0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBub24tc3ludGF4IGVycm9ycyBpbiBkaXJlY3RvcnkgYW5kIGFjY291bnQgZm9yIGNoYW5nZXMgaW4gbmV3ZXIgZm9ybWF0XG4gICAgICAgICAgICAgIGVsc2UgaWYgKChtYXRjaGVzX2RpciAhPSBudWxsIHx8IG1hdGNoZXNfbmV3X2RpciAhPSBudWxsKSAmJiBtYXRjaGVzX2Jsb2NrID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVzID0gbWF0Y2hlc19kaXIgPT0gbnVsbCA/IG1hdGNoZXNfbmV3X2RpclsxXSA6IG1hdGNoZXNfZGlyWzFdXG5cbiAgICAgICAgICAgICAgICAvLyBkaXIgd2lsbCBiZSByZWxhdGl2ZSBhZnRlciBsaW50ZXIgcHJvY2Vzc2VzIGl0LCBzbyBpZiBkaXIgYmVpbmcgbGludGVkIGlzIHRoZSByb290IG9mIHRoZSBwcm9qZWN0IHBhdGgsIHRoZW4gaXQgd2lsbCBiZSBlbXB0eSBvbiBkaXNwbGF5XG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9hdG9tLmlvL2RvY3MvYXBpL3YxLjkuNC9Qcm9qZWN0I2luc3RhbmNlLXJlbGF0aXZpemVQYXRoXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIHBhdGggdG8gdGhlIHByb2plY3QgZGlyIGNvbnRhaW5pbmcgdGhlIGZpbGUgaXMgdGhlIHNhbWUgYXMgdGhlIGRpciBjb250YWluaW5nIHRoZSBmaWxlLCBtZWFuaW5nIHRoZSBmaWxlIGlzIGluIHRoZSByb290IGRpciBvZiB0aGUgcHJvamVjdCBpZiB0cnVlXG4gICAgICAgICAgICAgICAgaWYgKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlKVswXSA9PSBkaXIpXG4gICAgICAgICAgICAgICAgICAvLyBpIHdvdWxkIGxvdmUgdG8gaW1wcm92ZSB0aGlzIGxhdGVyLCBlc3BlY2lhbGx5IHNvIGl0IGNvdWxkIGJlIGFib3ZlIHRoZSBjb25kaXRpb25hbHNcbiAgICAgICAgICAgICAgICAgIGRpciA9IGRpciArICcgJ1xuXG4gICAgICAgICAgICAgICAgdG9SZXR1cm4ucHVzaCh7XG4gICAgICAgICAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgIGV4Y2VycHQ6ICdOb24tc3ludGF4IGVycm9yIGluIGRpcmVjdG9yeTogJyArIG1hdGNoZXMgKyAnLicsXG4gICAgICAgICAgICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBmaWxlOiBkaXIsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMV1dLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiJdfQ==