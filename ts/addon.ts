import { addon } from "./lib/utilities/ember-cli-entities";
import path from "path";
import Funnel from "broccoli-funnel";
import SassCompiler from "./sass-compiler";
import mergeTrees from "broccoli-merge-trees";

class SASSPlugin {
  name: string;
  optionsFn: any;
  ext: string[];
  toTree: any;
  constructor(optionsFn: any) {
    this.name = "fast-sass";
    this.optionsFn = optionsFn;
    this.ext = ["scss", "sass"];
  }
}

SASSPlugin.prototype.toTree = function (
  tree: any,
  inputPath: string,
  _outputPath: string,
  inputOptions: any
) {
  var options = Object.assign({}, this.optionsFn(), inputOptions);
  var inputTrees: Funnel[];

  if (options.onlyIncluded) {
    inputTrees = [
      new Funnel(tree, {
        include: ["app/styles/**/*"],
        annotation: "Funnel (styles)",
      }),
    ];
  } else {
    inputTrees = [
      new Funnel(tree, {
        include: ["**/*.scss", "**/*.css"],
      }),
    ];
  }

  if (options.includePaths) {
    inputTrees = inputTrees.concat(options.includePaths);
  }

  options.implementation = require("sass");

  var ext = options.extension || "scss";
  var paths = options.outputPaths;
  var trees: Array<SassCompiler | Funnel> = Object.keys(paths).map(function (
    file
  ) {
    var input = path.join(inputPath, file + "." + ext);
    var output = paths[file];
    return new SassCompiler(inputTrees, input, output, options);
  });

  if (options.passthrough) {
    trees.push(new Funnel(tree, options.passthrough));
  }

  return mergeTrees(trees);
};

export default addon({
  name: "fast-sass",
  included(app) {
    this._super.included.apply(this, arguments);
    this.app = app;

    app.registry.add("css", new SASSPlugin(this.sassOptions.bind(this)));
  },
  sassOptions() {
    const env = process.env.EMBER_ENV;
    const app = this.app;
    const parent = this.parent;
    const hostApp = this._findHost && this._findHost();
    const options =
      (app && app.options && app.options.sassOptions) ||
      (parent && parent.options && parent.options.sassOptions) ||
      (hostApp && hostApp.options && hostApp.options.sassOptions) ||
      {};

    if (options.sourceMap === undefined && env == "development") {
      options.sourceMap = true;
    }

    if (options.sourceMap || options.sourceMapEmbed) {
      // we need to embed the sourcesContent in the source map until libsass has better support for broccoli-sass
      options.sourceMapContents = true;
    }
    options.outputFile = options.outputFile || this.project.name() + ".css";
    options.sourceMapRoot = path.join(this.project.root, "app/styles");

    return options;
  },
});
