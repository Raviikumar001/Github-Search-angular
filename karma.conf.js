module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter"), /
    ],
    reporters: ["progress", "kjhtml", "coverage-istanbul"], 
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "./coverage"), // Directory for coverage reports
      reports: ["html", "lcovonly", "text-summary"], // Coverage formats (e.g., HTML, lcov, summary)
      fixWebpackSourcePaths: true,
    },
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true,
  });
};
