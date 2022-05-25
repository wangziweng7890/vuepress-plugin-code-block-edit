const fs = require("fs-extra");
const path = require("path");
const shell = require("shelljs");
const chalk = require("chalk");
const ora = require("ora");
const inquirer = require("inquirer");
module.exports = class Schedule {
  async run() {
    const spinner = ora(chalk.blue("正在生成文件，请稍等...")).start();
    this.initTemplate();
    spinner.stop();
    this.writeJson();
    await this.installDependencies(spinner); // 安装相关依赖
  }

  initTemplate() {
    fs.copySync(
      path.join(__dirname, "../templates"),
      path.join(process.cwd(), "docs"),
      {
        overwrite: true,
      }
    );
  }

  writeJson() {
    const jsonPath = path.join(process.cwd(), "package.json");
    let jsonValue = fs.readJsonSync(jsonPath);
    if (!jsonValue.devDependencies) {
      jsonValue.devDependencies = {};
    }
    jsonValue.devDependencies["vuepress"] = "1.9.7";
    jsonValue.scripts["docs:dev"] = "vuepress dev docs";
    fs.writeJSONSync(jsonPath, jsonValue, {
      spaces: "\t",
    });
  }

  installDependencies(spinner) {
    return inquirer
      .prompt([
        {
          type: "list",
          name: "choice",
          message: "选择您的包管理工具来安装vuepress相关依赖:",
          default: 0,
          choices: [
            { value: "npm install", name: "npm" },
            { value: "cnpm install", name: "cnpm" },
            { value: "yarn add", name: "yarn" },
          ],
        },
      ])
      .then((answers) => {
        spinner.text = "配置文件更新完成，正在安装相关依赖，请耐心等待...";
        spinner.start();
        const reply = shell.exec(`${answers.choice}`);
        if (reply.code !== 0) {
          shell.exit(1);
        }
      })
      .catch((error) => {
        console.log('选择包管理工具出错', error);
        shell.exit(1);
      })
      .finally(() => {
        spinner.stop();
      });
  }
};
