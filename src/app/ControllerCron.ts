import path from 'path';
const fs = require('fs');

const CronJob = require('cron').CronJob;
const pastaParaExcluir = path.resolve(__dirname, '..', '..', 'download'); 

function excluirPastaRecursivamente(pasta: any) {
  if (fs.existsSync(pasta)) {
    fs.readdirSync(pasta).forEach((arquivo: any) => {
      const caminhoCompleto = path.join(pasta, arquivo);

      if (fs.lstatSync(caminhoCompleto).isDirectory()) {
        excluirPastaRecursivamente(caminhoCompleto);
      } else {
        fs.unlinkSync(caminhoCompleto);
      }
    });

    fs.rmdirSync(pasta);

    fs.mkdir(path.resolve(__dirname, '..', '..', 'download'), (err: string) => {
      if (err) {
        console.log(err);
        return
      }

      console.log("Diretório criado! =)")
    });

    console.log('Pasta excluída com sucesso:', pasta);
  } else {
    console.log('A pasta não existe:', pasta);
  }
}

class ControllerCron {
  async fileDelete() {
    const job = new CronJob('19 11 * * *', async () => {
      excluirPastaRecursivamente(pastaParaExcluir);
    }, null, true, 'America/Sao_Paulo');

    job.start();
  }
}

export default new ControllerCron();