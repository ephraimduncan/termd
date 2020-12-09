# termd

> Render Markdown in the Terminal

[![NPM Version][npm-image]][npm-url]

Preview and render markdown files in the terminal with color syntax highlighting. Also render markdown from a given `url` or from a GitHub repository and an npm package.

## Installation

```sh
npm install -g termd
```

## Usage example

### Basic usage

To render a markdown file in the terminal, use the `termd` command with the file name or relative path to the markdown file.

```sh
termd <filename>

# Example
termd readme.md

....
```

#### Commands

```
--string, -s    Use a string with markdown syntax
--url, -u       Render markdown from url in the terminal
--npm, -n       Render npm package readme in the terminal
--github, -g    Render github repository readme in the terminal
```

#### Examples

##### Render a markdown syntax in the terminal

```sh
termd --string="## Heading 2"
termd -s ## Heading 2
Heading 2
```

##### Render a markdown from a given url

```sh
termd --url="https://some.url/with/markdown/file"
termd -u https://some.url/with/markdown/file
...
```

##### Render readme of an npm package

```sh
termd --npm="termd" # Package name
termd -n termd
...
```

##### Render readme of a github repository

```
termd --github="dephraiim/termd" # Repo Owner / Repo Name
termd -g dephraiim/termd
...
```

## Development setup

To begin developing, do this.

```sh
git clone https://github.com/dephraiim/termd.git
cd termd
npm install
```

## Contributing

1. [Fork](https://github.com/dephraiim/termd/fork) it
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## License

MIT © [Ephraim Atta-Duncan](https://twitter.com/dephraiim)

<!-- Markdown link & img dfn's -->

[npm-image]: https://img.shields.io/npm/v/termd.svg
[npm-url]: https://npmjs.org/package/termd
