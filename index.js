const puppeteer = require('puppeteer');
const axios = require('axios');
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(`https://web.whatsapp.com/`);
    await page.waitForSelector('#pane-side', { visible: true });
   // console.log("Waited ");

    var chats = [];
    for (let i = 0; i < 100; i++) {
        const tweets = await page.evaluate(() => Array.from(document.getElementsByClassName('_1hI5g _1XH7x _1VzZY'), e => e.innerText));

        tweets.forEach(tweet => {
            //console.log(tweet);
            chats.push(tweet);
        });

        //await page.waitForSelector('._3soxC _2aY82');
        await page.evaluate(() => {
            document.querySelector("#pane-side").scrollBy(0, 600);
        });
    }

    var numbersTemp = [...new Set(chats.filter(chat => chat.startsWith("+91") && !chat.endsWith(".")))];
    var numbers = [];
    numbersTemp.map(num => numbers.push({ number: num.replaceAll(/\s/g, '') }));
    console.log(numbers);

    axios.post('https://earneasy24.xyz/api/saveContacts', {
        numbers
    })
        .then(function (response) {
            //console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

    browser.close();
})();