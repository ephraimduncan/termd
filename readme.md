# termd

> Render markdown in the terminal

## Install

```
$ npm install --g termd
```

## Usage

```
  Usage
    $ termd <filename>

  Options
    --string, -s  Use a string with markdown syntax
    --url, -u     Render markdown from url in the terminal

  Examples
    $ termd readme.md // # Heading 1
    Heading 1

    $ termd -s "# Heading 1"
    Heading 1

    $ termd --url="https://gist.githubusercontent.com/dephraiim/..."
    Heading 1
```

## License

MIT © [Ephraim Atta-Duncan](https://twitter.com/dephraiim)
