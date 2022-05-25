const chalk = require('chalk') ;
const commander = require('commander') ;
const pkg = require('../../package.json') ;
const initStandard = require("./standard");
const { program } = commander;

program
  .version(pkg.version, '-v --version')
  .description('create vuepress-docs for your vue-cli proj')
  .action(() => {
    console.log(chalk.green('Welcome !'));
  });

program
  .command('init')
  .description('Initial config')
  .action(initStandard);

program.on('--help', () => {
  console.log('no help, just do it!');
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
