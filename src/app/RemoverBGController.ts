import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { resolve } from 'path';

class RemoverBGController {

    async store(request: Request, response: Response) {

        const file = request.file;

        if(file !== null && file !== undefined) { 

            if( file.size > 9815779) {
                const res = {
                    status: 2,
                    error: "The file object is larger than 10 mb.",
                    path: null
                }

                fs.unlink(resolve(__dirname, '..', 'upload/'+file.filename), function (err) {
                    if(err) throw err;
                    console.log('File deleted!');
                });
    
                return response.status(400).json(res);
            }

            let type = file.mimetype.split('/');

            if(type[0] != 'image') {
                const res = {
                    status: 1,
                    error: "O objeto file não e uma imagem.",
                    path: null
                }

                fs.unlink(resolve(__dirname, '..', 'upload/'+file.filename), function (err) {
                    if(err) throw err;
                    console.log('File deleted!');
                });
    
                return response.status(400).json(res);
            }   
        } else {
            const res = {
                status: 1,
                error: "O objeto file é nulo ou indefinido.",
                path: null
            }

            return response.status(400).json(res);
        }

        try {

            const browser: any = await puppeteer.launch({ 
                headless: true,
                //headless: false,
                args: [
                    "--disable-setuid-sandbox",
                    "--no-sandbox",
                  /*   "--single-process", */
                    "--no-zygote",
                ]   
            });
        
            const page = await browser.newPage();
            await page.goto('https://br.depositphotos.com/bgremover/upload.html', { waitUntil: 'domcontentloaded' });
        
            await page.waitForTimeout(1000);
        
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const enviarImagemButton: any = buttons.find(button => button.innerText.includes('Fazer upload de arquivo'));
                enviarImagemButton.click();
            });
        
            await page.waitForTimeout(2000);
        
            const inputUploadHandle: any = await page.$('input[type=file]');
            let fileToUpload = resolve(__dirname, '..', 'upload/'+file.filename);
            inputUploadHandle.uploadFile(fileToUpload);
        
            console.log('clicou pra carregar a imagem');
        
            const imgSelector = 'img._VGRaJ';
            
            try {
                await page.waitForSelector(imgSelector);

                console.log('pagina já carregou');
    
                const imgSrc = await page.evaluate((selector: any) => {
                    const imgElement = document.querySelector(selector);
                    console.log('Imagem selecionada');
                    console.log(imgElement)
        
                    return imgElement?.src;
                }, imgSelector);
        
                const imgBuffer = Buffer.from(imgSrc.split(',')[1], 'base64');
            
                fs.writeFileSync(resolve(__dirname, '..', `download/${file.filename}`), imgBuffer);
        
                await page.waitForTimeout(2000);
            
                browser.close();
        
                console.log('Imagem salva com sucesso na raiz do projeto:', file.filename);
                    
                let fileName: string[] = file.filename.split('.');
                let imageName: string = fileName[0]+'.png';
        
                fs.unlink(fileToUpload, function (err) {
                    if(err) throw err;
                    console.log('File deleted!');
                });
        
                const oldFilePath: string = resolve(__dirname, '.', '..', `download/${file.filename}`);
                const newFilePath: string = resolve(__dirname, '.', '..', `download/${imageName}`);
        
                fs.renameSync(oldFilePath, newFilePath);
        
                const res = {
                    status: 0,
                    error: null,
                    path: "http://192.81.213.228:8888/files/"+imageName
                }
                
                return response.status(200).json(res);
                
            } catch (error) {
                
                const res = {
                    status: 3,
                    error: "Image não foi carregada.",
                    path: null
                }
    
                fs.unlink(resolve(__dirname, '.', '..', 'upload/'+file.filename), function (err) {
                    if(err) throw err;
                    console.log('File deleted! ');
                });
    
                await browser.close();
                return response.status(400).json(res);
            }

        } catch (error) {
            // Tratar erro caso algo dê errado no Puppeteer ou na requisição
            console.error('Erro durante a execução do Puppeteer:', error);

            const res = {
                status: 4,
                error: "Erro durante a execução do Puppeteer.",
                path: null
            }

            fs.unlink(resolve(__dirname, '.', '..', 'upload/' + file.filename), function (err) {
                if (err) throw err;
                console.log('File deleted! ');
            });

            return response.status(500).json(res);
        }
    }
}

export default new RemoverBGController(); 