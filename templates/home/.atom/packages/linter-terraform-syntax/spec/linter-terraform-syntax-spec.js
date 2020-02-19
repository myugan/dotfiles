'use babel';

import * as path from 'path';

describe('The Terraform provider for Linter', () => {
  const lint = require(path.join(__dirname, '../lib/main.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-terraform-syntax');
      return atom.packages.activatePackage('language-terraform').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures/clean', 'test.tf'))
      );
    });
  });

  describe('checks a file with a syntax issue', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/syntax', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("expected: IDENT | STRING | ASSIGN | LBRACE got: SUB");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[8, 13], [8, 14]]);
        });
      });
    });
  });

  describe('checks a file with a syntax issue in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/syntax', 'test_two.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("expected: IDENT | STRING | ASSIGN | LBRACE got: SUB");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[8, 13], [8, 14]]);
        });
      });
    });
  });

  describe('checks a file with a syntax issue with the new format', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/unexpected_paran', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('Error reading config for eks: expected "}" but found ")"');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 28], [0, 29]]);
        });
      });
    });
  });

  describe('checks a file with a syntax issue with an alternate format', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/bad_var_interpolate', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('error parsing local value "kube_config_static": expected ")" but found opening quote');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[8, 23], [8, 24]]);
        });
      });
    });
  });

  describe('checks a file with a syntax issue with an alternate format in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/bad_var_interpolate', 'test_two.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('error parsing local value "kube_config_static": expected ")" but found opening quote');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+test\.tf$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[8, 23], [8, 24]]);
        });
      });
    });
  });

  describe('checks a file with an unknown resource in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/unknown_resource', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("Non-syntax error in directory: resource 'digitalocean_domain.domain' config: unknown resource 'digitalocean_droplet.droplet' referenced in variable digitalocean_droplet.droplet.ipv4_address.");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+unknown_resource$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  describe('checks a file with a required field missing in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/required_field', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(2);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('Non-syntax error in directory: digitalocean_floating_ip.float: "region": required field is not set.');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+required_field$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
          expect(messages[1].severity).toBeDefined();
          expect(messages[1].severity).toEqual('error');
          expect(messages[1].excerpt).toBeDefined();
          expect(messages[1].excerpt).toEqual('Non-syntax error in directory: digitalocean_floating_ip.float: droplet_id: cannot parse \'\' as int: strconv.ParseInt: parsing "droplet": invalid syntax.');
          expect(messages[1].location.file).toBeDefined();
          expect(messages[1].location.file).toMatch(/.+required_field$/);
          expect(messages[1].location.position).toBeDefined();
          expect(messages[1].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  describe('checks a file with a missing file in the directory', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/missing_file', 'test.tf');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("Non-syntax error in directory: digitalocean_ssh_key.key: file: open /foo/bar/baz: no such file or directory in:.");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+missing_file$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      const goodFile = path.join(__dirname, 'fixtures/clean', 'test.tf');
      return atom.workspace.open(goodFile).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      );
    });
  });
});
