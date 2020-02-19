'use babel';

export default {
  config: {
    terraformExecutablePath: {
      title: 'Terraform Executable Path',
      type: 'string',
      description: 'Path to Terraform executable (e.g. /usr/local/terraform/bin/terraform) if not in shell env path.',
      default: 'terraform',
      order: 1,
    },
    useTerraformPlan: {
      title: 'Use Terraform Plan',
      description: 'Use \'terraform plan\' instead of \'validate\' for linting (will also display plan errors for directory of current file)',
      type: 'boolean',
      default: false,
    },
    useTerraformFormat: {
      title: 'Use Terraform Fmt',
      description: 'Use \'terraform fmt\' to rewrite all Terraform files in the directory of the current file to a canonical format (occurs before linting).',
      type: 'boolean',
      default: false,
    },
    blacklist: {
      title: 'Exclude Regexp for .tf',
      type: 'string',
      description: 'Regular expression for .tf filenames to ignore (e.g. foo|[bB]ar would ignore afoo.tf and theBar.tf).',
      default: '',
    },
    globalVarFiles: {
      title: 'Global Var Files',
      type: 'array',
      description: 'Var files specified by absolute paths that should be applied to all projects.',
      default: [''],
      items: {
        type: 'string'
      }
    },
    localVarFiles: {
      title: 'Local Var Files',
      type: 'array',
      description: 'Var files specified by relative paths to each project that should be applied. If these files are not in the same relative path within each project this will fail.',
      default: [''],
      items: {
        type: 'string'
      }
    },
    checkRequiredVar: {
      title: 'Check Required Variables',
      type: 'boolean',
      description: 'Check whether all required variables have been specified (unchecking is useful if primarily developing/declaring modules; only works with validate).',
      default: true,
    },
    newVersion: {
      title: 'Terraform >= 0.12 Support',
      type: 'boolean',
      description: 'Your installed version of Terraform is >= 0.12.',
      default: false,
    }
  },

  // activate linter
  activate() {
    const helpers = require("atom-linter");

    // auto-detect terraform >= 0.12
    helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['validate', '--help']).then(output => {
      if (/-json/.exec(output))
        // terraform >= 0.12
        atom.config.set('linter-terraform-syntax.newVersion', true)
      else {
        // terraform < 0.12
        atom.config.set('linter-terraform-syntax.newVersion', false)

        // check for terraform >= minimum version since it is < 0.12
        helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['destroy', '--help']).then(output => {
          if (!(/-auto-approve/.exec(output))) {
            atom.notifications.addError(
              'The terraform installed in your path is unsupported.',
              {
                detail: "Please upgrade your version of Terraform to >= 0.11 or downgrade this package to 1.2.6.\n"
              }
            );
          }
        });
      }
    });
  },

  provideLinter() {
    return {
      name: 'Terraform',
      grammarScopes: ['source.terraform'],
      scope: 'project',
      lintsOnChange: false,
      lint: (activeEditor) => {
        // establish const vars
        const helpers = require('atom-linter');
        const file = process.platform === 'win32' ? activeEditor.getPath().replace(/\\/g, '/') : activeEditor.getPath();
        // try to get file path and handle errors appropriately
        try {
          var dir = require('path').dirname(file);
        }
        catch(error) {
          // notify on stdin error
          if (/\.dirname/.exec(error.message) != null) {
            atom.notifications.addError(
              'Terraform cannot lint on stdin due to nonexistent pathing on directories. Please save this config to your filesystem.',
              {
                detail: 'Save this config.'
              }
            );
          }
          // notify on other errors
          else {
            atom.notifications.addError(
              'An error occurred with this package.',
              {
                detail: error.message
              }
            );
          };
        }

        // bail out if this is on the blacklist
        if (atom.config.get('linter-terraform-syntax.blacklist') !== '') {
          blacklist = new RegExp(atom.config.get('linter-terraform-syntax.blacklist'))
          if (blacklist.exec(file))
            return [];
        }

        // regexps for matching syntax errors on output
        const regex_syntax = /Error.*\/(.*\.tf):\sAt\s(\d+):(\d+):\s(.*)/;
        const new_regex_syntax = /Error:.*\/(.*\.tf): (.*:).* at (\d+):(\d+):(.*)/;
        const alt_regex_syntax = /Error:.*\/(.*\.tf): (.*) at (\d+):(\d+):.* at \d+:\d+(: .*)/;
        // regexps for matching non-syntax errors on output
        const dir_error = /\* (.*)/;
        const new_dir_error = /Error: (.*)/;

        // establish args
        var args = atom.config.get('linter-terraform-syntax.useTerraformPlan') ? ['plan'] : ['validate'];
        args.push('-no-color');

        // initialize options with normal defaults
        var options = { cwd: dir, stream: 'stderr', allowEmptyStderr: true }

        // json output for validate if >= 0.12
        if (!(atom.config.get('linter-terraform-syntax.useTerraformPlan')) && atom.config.get('linter-terraform-syntax.newVersion')) {
          args.push('-json')
          // stdout for json output so also have to ignore exit code
          options = { cwd: dir, ignoreExitCode: true }
        }
        // var inputs are only valid for other than >= 0.12 validate
        else {
          // add global var files
          if (atom.config.get('linter-terraform-syntax.globalVarFiles')[0] != '')
            for (i = 0; i < atom.config.get('linter-terraform-syntax.globalVarFiles').length; i++)
              args.push(...['-var-file', atom.config.get('linter-terraform-syntax.globalVarFiles')[i]]);

          // add local var files
          if (atom.config.get('linter-terraform-syntax.localVarFiles')[0] != '')
            for (i = 0; i < atom.config.get('linter-terraform-syntax.localVarFiles').length; i++)
              args.push(...['-var-file', atom.config.get('linter-terraform-syntax.localVarFiles')[i]]);

          // do not check if required variables are specified if desired
          if (!(atom.config.get('linter-terraform-syntax.checkRequiredVar')) && !(atom.config.get('linter-terraform-syntax.useTerraformPlan')))
            args.push('-check-variables=false')
        }

        // execute terraform fmt if selected
        if (atom.config.get('linter-terraform-syntax.useTerraformFormat'))
          helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), ['fmt', '-list=false', dir])

        return helpers.exec(atom.config.get('linter-terraform-syntax.terraformExecutablePath'), args, options).then(output => {
          var toReturn = [];

          // new terraform validate will be doing JSON parsing
          if (!(atom.config.get('linter-terraform-syntax.useTerraformPlan')) && atom.config.get('linter-terraform-syntax.newVersion')) {
            info = JSON.parse(output)

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
                else if (atom.project.relativizePath(file)[0] == dir)
                  file = dir + ' '

                toReturn.push({
                  severity: issue.severity,
                  excerpt: issue.summary,
                  description: issue.detail,
                  location: {
                    file: file,
                    position: [[line_start, line_end], [col_start, col_end]],
                  },
                });
              });
            }
          }
          // everything else proceeds as normal
          else {
            output.split(/\r?\n/).forEach(function (line) {
              if (process.platform === 'win32')
                line = line.replace(/\\/g, '/')

              // matchers for output parsing and capturing
              const matches_syntax = regex_syntax.exec(line);
              const matches_new_syntax = new_regex_syntax.exec(line);
              const matches_alt_syntax = alt_regex_syntax.exec(line);
              const matches_dir = dir_error.exec(line);
              const matches_new_dir = new_dir_error.exec(line);
              // ensure useless block info is not captured and displayed
              const matches_block = /occurred/.exec(line);
              // recognize and display when terraform init would be more helpful
              const matches_init = /error satisfying plugin requirements|terraform init/.exec(line)

              // check for syntax errors in directory
              if (matches_syntax != null) {
                toReturn.push({
                  severity: 'error',
                  excerpt: matches_syntax[4],
                  location: {
                    file: dir + '/' + matches_syntax[1],
                    position: [[Number.parseInt(matches_syntax[2]) - 1, Number.parseInt(matches_syntax[3]) - 1], [Number.parseInt(matches_syntax[2]) - 1, Number.parseInt(matches_syntax[3])]],
                  },
                });
              }
              // check for new or alternate format syntax errors in directory (alt first since new also captures alt but botches formatting)
              else if ((matches_alt_syntax != null) || (matches_new_syntax != null)) {
                matches = matches_alt_syntax == null ? matches_new_syntax : matches_alt_syntax;

                toReturn.push({
                  severity: 'error',
                  excerpt: matches[2] + matches[5],
                  location: {
                    file: dir + '/' + matches[1],
                    position: [[Number.parseInt(matches[3]) - 1, Number.parseInt(matches[4]) - 1], [Number.parseInt(matches[3]) - 1, Number.parseInt(matches[4])]],
                  },
                });
              }
              // check for non-syntax errors in directory and account for changes in newer format
              else if ((matches_dir != null || matches_new_dir != null) && matches_block == null) {
                matches = matches_dir == null ? matches_new_dir[1] : matches_dir[1]

                // dir will be relative after linter processes it, so if dir being linted is the root of the project path, then it will be empty on display
                // https://atom.io/docs/api/v1.9.4/Project#instance-relativizePath
                // check if the path to the project dir containing the file is the same as the dir containing the file, meaning the file is in the root dir of the project if true
                if (atom.project.relativizePath(file)[0] == dir)
                  // i would love to improve this later, especially so it could be above the conditionals
                  dir = dir + ' '

                toReturn.push({
                  severity: 'error',
                  excerpt: 'Non-syntax error in directory: ' + matches + '.',
                  location: {
                    file: dir,
                    position: [[0, 0], [0, 1]],
                  },
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
