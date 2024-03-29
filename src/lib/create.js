const fs = require("fs-extra")
const path = require("path")
const chalk = require("chalk")
const inquirer = require("inquirer")

import generator from "./generator"
import prompt from "./prompt"
import download from "./download"
const { error, stopSpinner, logWithSpinner } = require("@vue/cli-shared-utils")

async function create(projectName, options) {
  const cwd = options.cwd || process.cwd()
  const inCurrent = projectName === "."
  const name = inCurrent ? path.relative("../", cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || ".")

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: "ok",
            type: "confirm",
            message: `是否创建在当前文件夹?`,
          },
        ])
        if (!ok) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: "action",
            type: "list",
            message: `文件夹 ${chalk.cyan(
              targetDir
            )} 已存在，请选择相应的操作:`,
            choices: [
              { name: "覆盖", value: "overwrite" },
              { name: "合并", value: "merge" },
              { name: "取消", value: false },
            ],
          },
        ])
        if (!action) {
          return
        } else if (action === "overwrite") {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
          await fs.remove(targetDir)
        }
      }
    }
  }
  const { url } = await inquirer.prompt({
    name: "url",
    message: `模板仓库git地址`,
  })
  if (!url) {
    error("模板仓库不能为空")
    return
  }
  const templateDir = path.join(targetDir, ".template")
  try {
    logWithSpinner("下载模板...")
    await download(templateDir, url)
    stopSpinner(false)
    const data = await prompt({ name })
    await generator(data, templateDir, targetDir)
  } catch (error) {
    error(error)
  }
  console.log(`\n ${chalk.keyword("orange")(name + "创建完成！")}`)
}

export default (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
  })
}
