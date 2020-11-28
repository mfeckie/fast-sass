import Plugin from "broccoli-caching-writer";
import path from "path";
import mkdirp from "mkdirp";
import fs from "fs";
import sass from "sass";

export interface SassOptions {
  file: string;
  includePaths: string[];
  outputStyle?: "expanded" | "compressed";
  precision: number;
  sourceComments: boolean;
  sourceMap?: boolean;
}

export default class SassCompiler extends Plugin {
  inputFile: string;
  outputFile: string;
  options: SassOptions;
  previous: never[];
  constructor(
    inputTrees: any,
    inputFile: string,
    outputFile: string,
    options: SassOptions
  ) {
    super(inputTrees, { ...options, persistentOutput: true });
    this.inputFile = inputFile;
    this.outputFile = outputFile;
    this.options = options;
    this.previous = [];
  }

  async build() {
    var destFile = path.join(this.outputPath, this.outputFile);

    var sassOptions: SassOptions = {
      file: path.join(this.inputPaths[0], this.inputFile),
      includePaths: this.inputPaths,
      outputStyle: this.options.outputStyle,
      precision: this.options.precision,
      sourceComments: this.options.sourceComments,
    };

    const result = sass.renderSync(sassOptions);

    try {
      fs.writeFileSync(destFile, result.css);
    } catch (error) {
      mkdirp.sync(path.dirname(destFile));
      fs.writeFileSync(destFile, result.css);
    }
  }
}
