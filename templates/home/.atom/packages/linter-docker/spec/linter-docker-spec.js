'use babel';

import { join } from 'path';
// eslint-disable-next-line no-unused-vars
import { it, fit, wait, beforeEach, afterEach } from 'jasmine-fix';

const fixturePath = join(__dirname, 'fixtures');
const goodPath = join(fixturePath, 'good', 'Dockerfile');
const badPath = join(fixturePath, 'bad', 'Dockerfile');
const badNoFromPath = join(fixturePath, 'bad-no-from', 'Dockerfile');
const badRepeatedCMDPath = join(fixturePath, 'bad-repeated-cmd', 'Dockerfile');
const emptyPath = join(fixturePath, 'empty', 'Dockerfile');

describe('The docker provider for Linter', () => {
  const { lint } = require('../lib/init').provideLinter();

  beforeEach(async () => {
    await atom.packages.activatePackage('linter-docker');
  });

  it('should be in the packages list', () =>
    expect(atom.packages.isPackageLoaded('linter-docker')).toBe(true));

  it('should be an active package', () =>
    expect(atom.packages.isPackageActive('linter-docker')).toBe(true));

  it('finds nothing wrong with a valid file', async () => {
    const editor = await atom.workspace.open(goodPath);
    const messages = await lint(editor);
    expect(messages.length).toBe(0);
  });

  it('shows errors in an a file with issues', async () => {
    const editor = await atom.workspace.open(badPath);
    const expected = 'UNKNOWN_COMMAND is invalid';
    const messages = await lint(editor);

    expect(messages[0].severity).toBe('error');
    expect(messages[0].excerpt).toBe(expected);
    expect(messages[0].location.file).toBe(badPath);
    expect(messages[0].location.position).toEqual([[1, 0], [1, 15]]);
    expect(messages.length).toBe(1);
  });

  it("shows errors in an a file without instruction 'FROM'", async () => {
    const editor = await atom.workspace.open(badNoFromPath);
    const expected = "First instruction must be 'FROM', is: RUN";
    const messages = await lint(editor);

    expect(messages[0].severity).toBe('error');
    expect(messages[0].excerpt).toBe(expected);
    expect(messages[0].location.file).toBe(badNoFromPath);
    expect(messages[0].location.position).toEqual([[0, 0], [0, 18]]);
    expect(messages.length).toBe(1);
  });

  it("shows errors in an a file with repeated instruction 'CMD'", async () => {
    const editor = await atom.workspace.open(badRepeatedCMDPath);
    const expected = 'Multiple CMD instructions found';
    const messages = await lint(editor);

    expect(messages[0].severity).toBe('error');
    expect(messages[0].excerpt).toBe(expected);
    expect(messages[0].location.file).toBe(badRepeatedCMDPath);
    expect(messages[0].location.position).toEqual([[2, 0], [2, 10]]);
    expect(messages.length).toBe(1);
  });

  it('shows errors in an empty file', async () => {
    const editor = await atom.workspace.open(emptyPath);
    const expected = `${emptyPath} does not contain any instructions`;
    const messages = await lint(editor);

    expect(messages[0].severity).toBe('error');
    expect(messages[0].excerpt).toBe(expected);
    expect(messages[0].location.file).toBe(emptyPath);
    expect(messages[0].location.position).toEqual([[0, 0], [0, 0]]);
    expect(messages.length).toBe(1);
  });
});
