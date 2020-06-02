#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));

var Metalsmith = require("metalsmith");

var Handlebars = require("handlebars");

var rm = require("rimraf").sync;

function generator () {
  var metadata = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var src = arguments.length > 1 ? arguments[1] : undefined;
  var dest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ".";

  if (!src) {
    return Promise.reject(new Error("\u65E0\u6548\u7684source\uFF1A".concat(src)));
  }

  var srcs = ["package.json", "public/index.html", "README.md"];
  return new Promise(function (resolve, reject) {
    Metalsmith(process.cwd()).metadata(metadata).clean(false).source(src).destination(dest).use(function (files, metalsmith, done) {
      var meta = metalsmith.metadata();
      Object.keys(files).forEach(function (fileName) {
        if (!srcs.includes(fileName)) {
          return;
        }

        var t = files[fileName].contents.toString();
        files[fileName].contents = Buffer.from(Handlebars.compile(t)(meta));
      });
      done();
    }).build(function (err) {
      rm(src);
      err ? reject(err) : resolve();
    });
  });
}

var inquirer = require("inquirer");

function prompt (context) {
  return inquirer.prompt([{
    name: "repositoryName",
    message: "仓库的名称",
    "default": context.name
  }, {
    name: "projectNameCn",
    message: "项目的名称"
  }]);
}

var download = require("download-git-repo");

var path = require("path");

function download$1 (target, url) {
  //   target = path.join(target || '.', '.template');
  return new Promise(function (resolve, reject) {
    // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
    download("direct:".concat(url, "#template"), target, {
      clone: true
    }, function (err) {
      if (err) {
        reject(err);
      } else {
        // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
        resolve(target);
      }
    });
  });
}

var fs = require("fs-extra");

var path$1 = require("path");

var chalk = require("chalk");

var inquirer$1 = require("inquirer");

var _require = require("@vue/cli-shared-utils"),
    error = _require.error,
    stopSpinner = _require.stopSpinner,
    logWithSpinner = _require.logWithSpinner;

function create(_x, _x2) {
  return _create.apply(this, arguments);
}

function _create() {
  _create = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(projectName, options) {
    var cwd, inCurrent, name, targetDir, _yield$inquirer$promp, ok, _yield$inquirer$promp2, action, _yield$inquirer$promp3, url, templateDir, data;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            cwd = options.cwd || process.cwd();
            inCurrent = projectName === ".";
            name = inCurrent ? path$1.relative("../", cwd) : projectName;
            targetDir = path$1.resolve(cwd, projectName || ".");

            if (!fs.existsSync(targetDir)) {
              _context.next = 31;
              break;
            }

            if (!options.force) {
              _context.next = 10;
              break;
            }

            _context.next = 8;
            return fs.remove(targetDir);

          case 8:
            _context.next = 31;
            break;

          case 10:
            if (!inCurrent) {
              _context.next = 19;
              break;
            }

            _context.next = 13;
            return inquirer$1.prompt([{
              name: "ok",
              type: "confirm",
              message: "\u662F\u5426\u521B\u5EFA\u5728\u5F53\u524D\u6587\u4EF6\u5939?"
            }]);

          case 13:
            _yield$inquirer$promp = _context.sent;
            ok = _yield$inquirer$promp.ok;

            if (ok) {
              _context.next = 17;
              break;
            }

            return _context.abrupt("return");

          case 17:
            _context.next = 31;
            break;

          case 19:
            _context.next = 21;
            return inquirer$1.prompt([{
              name: "action",
              type: "list",
              message: "\u6587\u4EF6\u5939 ".concat(chalk.cyan(targetDir), " \u5DF2\u5B58\u5728\uFF0C\u8BF7\u9009\u62E9\u76F8\u5E94\u7684\u64CD\u4F5C:"),
              choices: [{
                name: "覆盖",
                value: "overwrite"
              }, {
                name: "合并",
                value: "merge"
              }, {
                name: "取消",
                value: false
              }]
            }]);

          case 21:
            _yield$inquirer$promp2 = _context.sent;
            action = _yield$inquirer$promp2.action;

            if (action) {
              _context.next = 27;
              break;
            }

            return _context.abrupt("return");

          case 27:
            if (!(action === "overwrite")) {
              _context.next = 31;
              break;
            }

            console.log("\nRemoving ".concat(chalk.cyan(targetDir), "..."));
            _context.next = 31;
            return fs.remove(targetDir);

          case 31:
            _context.next = 33;
            return inquirer$1.prompt({
              name: "url",
              message: "\u6A21\u677F\u4ED3\u5E93git\u5730\u5740"
            });

          case 33:
            _yield$inquirer$promp3 = _context.sent;
            url = _yield$inquirer$promp3.url;

            if (url) {
              _context.next = 38;
              break;
            }

            error("模板仓库不能为空");
            return _context.abrupt("return");

          case 38:
            templateDir = path$1.join(targetDir, ".template");
            _context.prev = 39;
            logWithSpinner("下载模板...");
            _context.next = 43;
            return download$1(templateDir, url);

          case 43:
            stopSpinner(false);
            _context.next = 46;
            return prompt({
              name: name
            });

          case 46:
            data = _context.sent;
            _context.next = 49;
            return generator(data, templateDir, targetDir);

          case 49:
            _context.next = 54;
            break;

          case 51:
            _context.prev = 51;
            _context.t0 = _context["catch"](39);

            _context.t0(_context.t0);

          case 54:
            console.log("\n ".concat(chalk.keyword("orange")(name + "创建完成！")));

          case 55:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[39, 51]]);
  }));
  return _create.apply(this, arguments);
}

var create$1 = (function () {
  return create.apply(void 0, arguments)["catch"](function (err) {
    stopSpinner(false); // do not persist

    error(err);
  });
});

var program = require("commander"); // const create = require("./lib/create")
program.command("create <project-name>").description("新建一个项目").option("-f, --force", "如果当前文件夹存在<project-name>，则进行覆盖").action(function (name, cmd) {
  var options = cleanArgs(cmd);
  create$1(name, options);
});
program.parse(process.argv);

function camelize(str) {
  return str.replace(/-(\w)/g, function (_, c) {
    return c ? c.toUpperCase() : "";
  });
} // commander passes the Command object itself as options,
// extract only actual options into a fresh object.


function cleanArgs(cmd) {
  var args = {};
  cmd.options.forEach(function (o) {
    var key = camelize(o["long"].replace(/^--/, "")); // if an option is not present and Command has a method with the same name
    // it should not be copied

    if (typeof cmd[key] !== "function" && typeof cmd[key] !== "undefined") {
      args[key] = cmd[key];
    }
  });
  return args;
}
