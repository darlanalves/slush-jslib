# Slush Generator for Javascript libs

Start a new Javascript library in a instant

## Install

```
npm install -g slush slush-jslib
```

## To start a new project

Open your terminal and go to a folder where you want to create the project


```

mkdir mylib
cd mylib
slush jslib

```

Follow the generator questions

After that, run `npm install` to get the required build packages

## Coding

On a terminal, open the folder where the library was started and run `make tdd`

- Write your tests into `/test`. Each unit should have a file here named `unit_name.spec.js`
- Write the source into `/src`. Each unit should have a file here named `unit.js`

## Making a release

Assuming that you already know Git and have a repository initialized, once you finish your first version run the `make build` command to generate the files you will release to the public. They will be saved into a `dist` folder.

Don't forget `npm publish` and/or `bower publish` if you are planning to release the library to the public