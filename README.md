# Slush Generator for Javascript libs

Start a new Javascript library in a instant

## Install

```
npm install -g slush slush-jslib
```

## Start a new project

Open your terminal and go to a folder where you want to create the project

```

mkdir mylib
cd mylib
slush jslib

```

Follow the generator questions. After that, run `npm install` to get the required build packages

## Coding

On a terminal, open the folder where the library was started and run `make tdd`

- Put your tests into `/test`. Each spec should be named `name-of-your-class.spec.js`
- Put the source into `/src`

On two separated terminals, run `make watch` to autobuild the source and `make tdd` to run the tests when a change is saved.

## Release

Once you have a working library, run `make bundle` to generate your library's code, **including a minifed version** on "dist" folder.

Add everything to a git repo and publish it to your DVCS of choice, like GitHub.

Don't forget `npm publish` and/or `bower publish` if you are planning to release the library to the public.

Happy coding!