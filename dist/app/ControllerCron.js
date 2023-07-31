"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app/ControllerCron.ts
var ControllerCron_exports = {};
__export(ControllerCron_exports, {
  default: () => ControllerCron_default
});
module.exports = __toCommonJS(ControllerCron_exports);
var import_path = __toESM(require("path"));
var fs = require("fs");
var CronJob = require("cron").CronJob;
var pastaParaExcluir = import_path.default.resolve(__dirname, "..", "..", "download");
function excluirPastaRecursivamente(pasta) {
  if (fs.existsSync(pasta)) {
    fs.readdirSync(pasta).forEach((arquivo) => {
      const caminhoCompleto = import_path.default.join(pasta, arquivo);
      if (fs.lstatSync(caminhoCompleto).isDirectory()) {
        excluirPastaRecursivamente(caminhoCompleto);
      } else {
        fs.unlinkSync(caminhoCompleto);
      }
    });
    fs.rmdirSync(pasta);
    console.log("Pasta exclu\xEDda com sucesso:", pasta);
  } else {
    console.log("A pasta n\xE3o existe:", pasta);
  }
}
var ControllerCron = class {
  async fileDelete() {
    const job = new CronJob("25 0 * * *", async () => {
      excluirPastaRecursivamente(pastaParaExcluir);
    }, null, true, "America/Sao_Paulo");
    job.start();
  }
};
var ControllerCron_default = new ControllerCron();
