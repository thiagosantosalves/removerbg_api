"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/server.ts
var import_express2 = __toESM(require("express"));
var import_path4 = __toESM(require("path"));

// src/router.ts
var import_express = require("express");
var import_multer2 = __toESM(require("multer"));

// src/app/RemoverBGController.ts
var import_puppeteer = __toESM(require("puppeteer"));
var import_fs = __toESM(require("fs"));
var import_path = require("path");
var RemoverBGController = class {
  async store(request, response) {
    const file = request.file;
    if (file !== null && file !== void 0) {
      if (file.size > 9815779) {
        const res = {
          status: 2,
          error: "The file object is larger than 10 mb.",
          path: null
        };
        import_fs.default.unlink((0, import_path.resolve)(__dirname, "..", "upload/" + file.filename), function(err) {
          if (err)
            throw err;
          console.log("File deleted!");
        });
        return response.status(400).json(res);
      }
      let type = file.mimetype.split("/");
      if (type[0] != "image") {
        const res = {
          status: 1,
          error: "O objeto file n\xE3o e uma imagem.",
          path: null
        };
        import_fs.default.unlink((0, import_path.resolve)(__dirname, "..", "upload/" + file.filename), function(err) {
          if (err)
            throw err;
          console.log("File deleted!");
        });
        return response.status(400).json(res);
      }
    } else {
      const res = {
        status: 1,
        error: "O objeto file \xE9 nulo ou indefinido.",
        path: null
      };
      return response.status(400).json(res);
    }
    const browser = await import_puppeteer.default.launch({
      headless: true,
      //headless: "new",
      //headless: false,
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"
      ]
    });
    const page = await browser.newPage();
    await page.goto("https://br.depositphotos.com/bgremover/upload.html", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1e3);
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const enviarImagemButton = buttons.find((button) => button.innerText.includes("Fazer upload de arquivo"));
      enviarImagemButton.click();
    });
    await page.waitForTimeout(2e3);
    const inputUploadHandle = await page.$("input[type=file]");
    let fileToUpload = (0, import_path.resolve)(__dirname, "..", "upload/" + file.filename);
    inputUploadHandle.uploadFile(fileToUpload);
    console.log("clicou pra carregar a imagem");
    const imgSelector = "img._VGRaJ";
    await page.waitForSelector(imgSelector);
    console.log("pagina j\xE1 carregou");
    const imgSrc = await page.evaluate((selector) => {
      const imgElement = document.querySelector(selector);
      console.log("Imagem selecionada");
      console.log(imgElement);
      return imgElement.src;
    }, imgSelector);
    if (imgSrc) {
      const imgBuffer = Buffer.from(imgSrc.split(",")[1], "base64");
      import_fs.default.writeFileSync((0, import_path.resolve)(__dirname, "..", `download/${file.filename}`), imgBuffer);
      await page.waitForTimeout(2e3);
      browser.close();
      console.log("Imagem salva com sucesso na raiz do projeto:", file.filename);
      let fileName = file.filename.split(".");
      let imageName = fileName[0] + ".png";
      import_fs.default.unlink(fileToUpload, function(err) {
        if (err)
          throw err;
        console.log("File deleted!");
      });
      const oldFilePath = (0, import_path.resolve)(__dirname, ".", "..", `download/${file.filename}`);
      const newFilePath = (0, import_path.resolve)(__dirname, ".", "..", `download/${imageName}`);
      import_fs.default.renameSync(oldFilePath, newFilePath);
      const res = {
        status: 0,
        error: null,
        path: "http://159.223.147.170:8888/files/" + imageName
      };
      return response.status(200).json(res);
    } else {
      const res = {
        status: 2,
        error: "Image n\xE3o foi carregada.",
        path: null
      };
      import_fs.default.unlink((0, import_path.resolve)(__dirname, ".", "..", "upload/" + file.filename), function(err) {
        if (err)
          throw err;
        console.log("File deleted!");
      });
      return response.status(400).json(res);
    }
  }
};
var RemoverBGController_default = new RemoverBGController();

// src/config/multer.ts
var import_multer = __toESM(require("multer"));
var import_crypto = __toESM(require("crypto"));
var import_path2 = require("path");
var multer_default = {
  storage: import_multer.default.diskStorage({
    destination: (0, import_path2.resolve)(__dirname, "..", "upload"),
    filename: (req, file, cb) => {
      import_crypto.default.randomBytes(16, (err, res) => {
        return cb(null, res.toString("hex") + (0, import_path2.extname)(file.originalname));
      });
    }
  })
};

// src/router.ts
var router = (0, import_express.Router)();
var upload = (0, import_multer2.default)(multer_default);
router.post("/", upload.single("file"), RemoverBGController_default.store);
var router_default = router;

// src/app/ControllerCron.ts
var import_path3 = __toESM(require("path"));
var fs2 = require("fs");
var CronJob = require("cron").CronJob;
var pastaParaExcluir = import_path3.default.resolve(__dirname, ".", "..", "download");
function excluirPastaRecursivamente(pasta) {
  if (fs2.existsSync(pasta)) {
    fs2.readdirSync(pasta).forEach((arquivo) => {
      const caminhoCompleto = import_path3.default.join(pasta, arquivo);
      if (fs2.lstatSync(caminhoCompleto).isDirectory()) {
        excluirPastaRecursivamente(caminhoCompleto);
      } else {
        fs2.unlinkSync(caminhoCompleto);
      }
    });
    fs2.rmdirSync(pasta);
    fs2.mkdir(import_path3.default.resolve(__dirname, ".", "..", "download"), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Diret\xF3rio criado! =)");
    });
    console.log("Pasta exclu\xEDda com sucesso:", pasta);
  } else {
    console.log("A pasta n\xE3o existe:", pasta);
  }
}
var ControllerCron = class {
  async fileDelete() {
    const job = new CronJob("0 0 * * *", async () => {
      excluirPastaRecursivamente(pastaParaExcluir);
    }, null, true, "America/Sao_Paulo");
    job.start();
  }
};
var ControllerCron_default = new ControllerCron();

// src/server.ts
require("dotenv").config();
var app = (0, import_express2.default)();
app.use(import_express2.default.json());
app.use(router_default);
app.use("/files", import_express2.default.static(import_path4.default.resolve(__dirname, "..", "download")));
app.use(router_default);
ControllerCron_default.fileDelete();
app.listen(8888, () => console.log(`server is run port 8888`));
