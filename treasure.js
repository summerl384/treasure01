class TreasureMap {
    constructor() {
        this.clues = {
            bed: "床边有一张名信片，是株洲某个景点的",
            desk: "书桌上有一个玩偶，似乎只有方特才有",
            wardrobe: "衣柜里某件衣服里有一张去株洲的车票",
            guitar: "吉他上有一个贴纸，小美去方特玩的时候好像见过"
        };
        this.uselessClues = {
            bed: "床上是小明最爱待的地方，上面有小明偷偷藏的 MP3，可惜对猜出小明干嘛去了没什么帮助",
            desk: "书桌上有厚厚的一本画册，里面全是我们，画的好丑！可惜对猜出小明干嘛去了没什么帮助",
            wardrobe: "衣柜里有我的几件衣服，我常常来小明家住，可惜对猜出小明干嘛去了没什么帮助",
            guitar: "吉他上有一朵小花，是我画的，小明当时差点揍了我一顿，可惜对猜出小明干嘛去了没什么帮助"
        };
        this.clickCount = 0;
        this.usefulClueCount = 0;
        this.bedClueFound = false;
        this.deskClueFound = false;
        this.wardrobeClueFound = false;
        this.guitarClueFound = false;
    }

    async findClue(buttonId) {
        if (this.usefulClueCount === 2) {
            document.getElementById('output').textContent = "你们成功猜出小明假期去了株洲方特，小明垂头丧气的把珍藏的辣条给你们了。";
            document.getElementById('output').style.fontSize = '20px';
            document.getElementById('output').style.fontWeight = 'bold';
            return;
        }
        if (this.clickCount >= 3) {
            if (this.usefulClueCount < 2) {
                document.getElementById('output').textContent = "游戏失败！";
                document.getElementById('fail-popup').style.display = 'block';
                return;
            }
        }
        const output = document.getElementById('output');
        const searching = document.getElementById('searching');
        const imageDisplay = document.getElementById('image-display');

        // 显示右上角的提示，包括线索计数和剩余点击次数，并持续更新
        let usefulClueText = `有用线索：${this.usefulClueCount}`;
        let remainingClicks = 3 - this.clickCount;
        searching.textContent = `你们正在翻找“${buttonId === 'bed'? '床' : buttonId === 'desk'? '书桌' : buttonId === 'wardrobe'? '衣柜' : '吉他'}”。${usefulClueText}，剩余点击次数：${remainingClicks}`;
        searching.style.fontSize = '20px';
        searching.style.fontWeight = 'bold';

        // 设置对应的图片路径
        let imagePath;
        switch (buttonId) {
            case 'bed':
                imagePath = 'bed.jpg';
                break;
            case 'desk':
                imagePath = 'shuzhuo.jpg';
                break;
            case 'wardrobe':
                imagePath = 'yigui.jpg';
                break;
            case 'guitar':
                imagePath = 'jita.jpg';
                break;
        }

        // 显示图片并放大一倍，同时调整位置使其居中
        imageDisplay.src = imagePath;
        imageDisplay.style.display = 'block';
        imageDisplay.style.transform = 'scale(2)';
        this.centerImage(imageDisplay);

        await new Promise(resolve => setTimeout(resolve, 5000));

        let randomNumber = Math.random();
        let result;
        if (randomNumber < 1 / 3) {
            // 找到线索
            result = this.clues[buttonId];
            if ((buttonId === 'bed' && this.bedClueFound) ||
                (buttonId === 'wardrobe' && this.wardrobeClueFound && buttonId!== 'bed' &&!this.bedClueFound)) {
                result = this.uselessClues[buttonId];
            } else if ((buttonId === 'desk' && this.deskClueFound) ||
                (buttonId === 'guitar' && this.guitarClueFound && buttonId!== 'desk' &&!this.deskClueFound)) {
                result = this.uselessClues[buttonId];
            } else {
                output.textContent = `你们选择翻找“${buttonId === 'bed'? '床' : buttonId === 'desk'? '书桌' : buttonId === 'wardrobe'? '衣柜' : '吉他'}”，找到了线索！\n${result}`;
                this.usefulClueCount++;
                if (buttonId === 'bed') this.bedClueFound = true;
                if (buttonId === 'desk') this.deskClueFound = true;
                if (buttonId === 'wardrobe') this.wardrobeClueFound = true;
                if (buttonId === 'guitar') this.guitarClueFound = true;
            }
        } else if (randomNumber < 2 / 3 && randomNumber > 1 / 3) {
            // 找到没用的线索
            result = this.uselessClues[buttonId];
            output.textContent = `你们选择翻找“${buttonId === 'bed'? '床' : buttonId === 'desk'? '书桌' : buttonId === 'wardrobe'? '衣柜' : '吉他'}”，找到了没用的线索。\n${result}`;
        } else {
            // 什么也没找到
            output.textContent = `你们选择翻找“${buttonId === 'bed'? '床' : buttonId === 'desk'? '书桌' : buttonId === 'wardrobe'? '衣柜' : '吉他'}”，很遗憾，什么也没找到。`;
        }
        searching.textContent = '';
        imageDisplay.style.display = 'none';
        imageDisplay.style.transform = 'scale(1)';
        imageDisplay.style.marginTop = '0';
        imageDisplay.style.marginLeft = '0';
        this.clickCount++;

        // 更新右上角计数器
        usefulClueText = `有用线索：${this.usefulClueCount}`;
        remainingClicks = 3 - this.clickCount;
        searching.textContent = `${usefulClueText}，剩余点击次数：${remainingClicks}`;
        searching.style.fontSize = '20px';
        searching.style.fontWeight = 'bold';

        // 加大输出文本字体
        output.style.fontSize = '20px';
        output.style.fontWeight = 'bold';
    }

    centerImage(imageElement) {
        const imgWidth = imageElement.clientWidth;
        const imgHeight = imageElement.clientHeight;
        imageElement.style.top = '50%';
        imageElement.style.left = '50%';
        imageElement.style.transformOrigin = 'center center';
        imageElement.style.marginTop = `-${imgHeight / 2}px`;
        imageElement.style.marginLeft = `-${imgWidth / 2}px`;
    }

    restartGame() {
        this.clickCount = 0;
        this.usefulClueCount = 0;
        this.bedClueFound = false;
        this.deskClueFound = false;
        this.wardrobeClueFound = false;
        this.guitarClueFound = false;
        document.getElementById('output').textContent = '';
        document.getElementById('fail-popup').style.display = 'none';

        // 重置右上角计数器
        document.getElementById('searching').textContent = '';
    }
}

const treasureMap = new TreasureMap();

// 在页面加载完成后显示活动开始前的提示
window.onload = function () {
    document.getElementById('output').textContent = "你们来到了小明家，小明提议让你们猜猜他假期干嘛去了（提示：点击按钮即可搜索线索）";
    document.getElementById('output').style.fontSize = '20px';
    document.getElementById('output').style.fontWeight = 'bold';
};

document.getElementById('bed').addEventListener('click', () => treasureMap.findClue('bed'));
document.getElementById('desk').addEventListener('click', () => treasureMap.findClue('desk'));
document.getElementById('wardrobe').addEventListener('click', () => treasureMap.findClue('wardrobe'));
document.getElementById('guitar').addEventListener('click', () => treasureMap.findClue('guitar'));

document.getElementById('restart-button').addEventListener('click', () => treasureMap.restartGame());