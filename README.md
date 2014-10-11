# Slush Generator for Javascript libs

## How

```
npm install -g slush slush-jslib
mkdir mylib;cd mylib
slush jslib

```

## After that

- `git init`
- Add the remote (also called the `origin`)
- Go to a terminal and run `gulp tdd`
- Writer your tests into `/test`
- Writer the source into `/src`

## If you are ready to build and release a version

- stop gulp
- run `gulp release`
- run `npm version` with one of the arguments:
	* `major` => v1.0.0
	* `minor` => v0.1.0
	( `patch` => v0.0.1
- `git push` and `git push --tags`
- optionally, `bower publish` and/or `npm publish`