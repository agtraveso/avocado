# avocado
Chromecast video player in Electron

## Install

First, clone the repo via git:

```bash
git clone https://github.com/alvarogtraveso/avocado.git
```

And then install dependencies.

```bash
$ cd avocado && npm install
```

Rebuild native Node.js modules against the version of Node.js from our Electron.

```bash
$ ./node_modules/.bin/electron-rebuild
```

:bulb: *This project uses native Node.js modules, whenever you install a new npm package, rerun electron-rebuild (https://github.com/electron/electron-rebuild)*

## Run

Just type:

```bash
$ npm run build && npm start
```


:bulb: *This project uses native Node.js modules. To avoid incompatibilities between node versions use:* https://github.com/electron/electron-rebuild *(already in devDependecies)*
