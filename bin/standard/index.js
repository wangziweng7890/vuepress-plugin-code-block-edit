const boxen = require("boxen");
const { BorderStyle } = boxen;
const chalk = require("chalk");
const Schedule = require("./schedule");

module.exports = async () => {
  const schedule = new Schedule();
  await schedule.run();

  console.log(
    boxen(
      chalk.green(`
      初始化完成！
      1.请运行 npm run docs:dev 来开启体验
    `),
      { padding: 1, margin: 1, borderStyle: "double" }
    )
  );
};
