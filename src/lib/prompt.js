const inquirer = require("inquirer")

export default function (context) {
  return inquirer.prompt([
    {
      name: "repositoryName",
      message: "仓库的名称",
      default: context.name,
    },
    {
      name: "projectNameCn",
      message: "项目的名称",
    },
  ])
}
