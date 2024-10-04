# Changelog

## Versioning

CyberChef Server uses the [semver](https://semver.org/) system to manage versioning: `<MAJOR>.<MINOR>.<PATCH>`.

- MAJOR version changes represent a significant change to the fundamental architecture of CyberChef and may (but don't always) make breaking changes that are not backwards compatible.
- MINOR version changes usually mean the addition of new operations or reasonably significant new features.
- PATCH versions are used for bug fixes and any other small tweaks that modify or improve existing capabilities.

All major and minor version changes will be documented in this file. Details of patch-level version changes can be found in [commit messages](https://github.com/gchq/CyberChef-server/commits/master).


## Details

### [1.0.0-beta] - 2024-10-04
- CyberChef functionality brought in line with the mainline release
- Upgraded to use ESM modules throughout
- Works with recent versions of NodeJS
- Re-orged the codebase slightly and slimmed down/updated some dependencies
- Upgraded the base Docker image to Node 18