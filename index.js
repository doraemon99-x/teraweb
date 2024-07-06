const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Video Downloader</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            <style>
                body {
                    background-color: #2c3e50;
                    color: #ecf0f1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    padding: 20px;
                    box-sizing: border-box;
                }
                .container {
                    background-color: #34495e;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                    width: 100%;
                    max-width: 500px;
                    text-align: center;
                }
                .btn-primary {
                    background-color: #2980b9;
                    border: none;
                }
                .btn-primary:hover {
                    background-color: #3498db;
                }
                footer {
                    padding-top: 20px;
                    text-align: center;
                    width: 100%;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Video Downloader</h1>
                <form action="/download" method="post">
                    <div class="form-group">
                        <label for="url">Masukkan URL:</label>
                        <input type="text" class="form-control" id="url" name="url" placeholder="Enter URL" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Download</button>
                </form>
            </div>
            <footer>
                <p>Developed by <a href="#" style="color: #3498db;">Your Name</a></p>
            </footer>
        </body>
        </html>
    `);
});

app.post('/download', async (req, res) => {
    const inputUrl = req.body.url;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://teradownloader.com/api/application', { waitUntil: 'networkidle2' });

        await page.evaluate((url) => {
            document.querySelector('input[name="url"]').value = url;
            document.querySelector('form').submit();
        }, inputUrl);

        await page.waitForSelector('.result');
        const data = await page.evaluate(() => {
            const results = [];
            document.querySelectorAll('.result-item').forEach(item => {
                results.push({
                    server_filename: item.querySelector('.filename').innerText,
                    dlink: item.querySelector('.download-link').href
                });
            });
            return results;
        });

        await browser.close();

        let result = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Download Links</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                <style>
                    body {
                        background-color: #ffffff;
                        color: #000000;
                        margin: 0;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                </style>
            </head>
            <body>
                <h1>Download Links</h1>
                <ul class="list-group">`;

        data.forEach(item => {
            result += `<li class="list-group-item">File Name: ${item.server_filename}<br>Download link: <a href="${item.dlink}" class="btn btn-link">${item.dlink}</a></li>`;
        });

        result += `</ul>
            </body>
            </html>`;
        res.send(result);
    } catch (error) {
        console.error('Error:', error.message);
        res.send(`Error: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
