/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

let drawing = false,
    bgColor = '34',
    rootColor = '120',
    rootDensity = 10,
    rootAngle = 0,
    rootSize = 0;   

const fillRec = () => { ctx.fillStyle = 'hsl(' + bgColor + ' , 78%, 91%)'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
fillRec();

class Root {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.maxSize = Math.random() * 7 + 5;
        this.size = Math.random() * 1 + 2 + Number(rootSize);
        this.vs = Math.random() * 0.2 + 0.05;
        this.angle = Math.random() * 6.2;
        this.va = Math.random() * 0.6 - 0.3 + Number(rootAngle);
        this.lightness = 37;
    }

    update() {
        this.x += this.speedX + Math.sin(this.angle);
        this.y += this.speedY;
        this.size += this.vs;
        this.angle += this.va;
        if (this.lightness < 70) this.lightness += 0.245;
        if (this.size < this.maxSize) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'hsl(' + rootColor + ', 37%, ' + this.lightness + '%)';
            ctx.fill();
            ctx.stroke();
            requestAnimationFrame(this.update.bind(this));
        }
    }
}


const save = document.querySelector('.save');
const clear = document.querySelector('.clear');
const reset = document.querySelector('.reset');
const continu = document.querySelector('.continue');
const popup = document.querySelector('.popup');
const ex = document.querySelector('.ex');
const image = document.querySelector('#img');
const loadImageBtn = document.querySelector('#loadImageBtn');
const postcard1 = document.querySelector('#postcard1');
const menu = document.querySelector('.menu');
const taTitle = document.querySelector('.taTitle');
const taText = document.querySelector('.taText');
const bg = document.querySelector('.bg');


const bgColorSlider = document.getElementById("bgColor");
const rootColorSlider = document.getElementById("rootColor");
const rootDensitySlider = document.getElementById("rootDensity");
const rootSizeSlider = document.getElementById("rootSize");
const rootAngleSlider = document.getElementById("rootAngle");


const changePopupStyle = (ppp, cnv, mn, b) => {
    popup.style.display = ppp;
    canvas.style.filter = cnv;
    menu.style.display = mn;
    bg.style.backgroundColor = b;
}



bgColorSlider.oninput = function () {
    bgColor = this.value;
    fillRec();
}

rootColorSlider.oninput = function () {
    rootColor = this.value;
}

rootDensitySlider.oninput = function () {
    rootDensity = this.value;
}

rootSizeSlider.oninput = function () {
    rootSize = this.value;
    console.log(rootSize)
}

rootAngleSlider.oninput = function () {
    rootAngle = this.value;
    console.log(rootAngle)
}

canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        for (let i = 0; i < rootDensity; i++) {
            const fromTop = canvas.getBoundingClientRect().top;
            const fromLeft = canvas.getBoundingClientRect().left;
            const root = new Root(e.x - fromLeft, e.y - fromTop)
            root.update();
        }
    }
})

window.addEventListener('mousedown', () => drawing = true)

window.addEventListener('mouseup', () => drawing = false)

save.addEventListener('click', () => {
    changePopupStyle('inline-block', 'brightness(0)', 'none', 'black');
    const dataURL = canvas.toDataURL();
    if (dataURL) image.setAttribute("src", dataURL);

    // canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    // window.location.href = dataURL;

})

clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fillRec();
})

ex.addEventListener('click', () => {
    changePopupStyle('none', 'opacity(1)', 'flex', 'var(--bg)')
})

// bg.addEventListener('click', () => {
//     changePopupStyle('none', 'opacity(1)', 'flex', 'var(--bg)')
// })

// canvas.addEventListener('click', () => {
//     changePopupStyle('none', 'opacity(1)', 'flex', 'var(--bg)')
// })


const createData = async (img, title, text) => {
    try {
        const response = await axios.post(`https://postcardsapi.herokuapp.com/api/v1/postcards/crt`, null, {
            params: {
                img: img,
                title: title,
                text: text
            }
        });
        console.log('sheesh', response)
        return response;
    } catch (error) {
        console.error(error);
    }
}

function dataURLtoBlob(dataURL) {
    let array, binary, i, len;
    binary = atob(dataURL.split(',')[1]);
    array = [];
    i = 0;
    len = binary.length;
    while (i < len) {
        array.push(binary.charCodeAt(i));
        i++;
    }
    return new Blob([new Uint8Array(array)], {
        type: 'image/jpeg'
    });

};

const createForm = () => {
    const form = new FormData();
    const title = taTitle.value;
    const text = taText.value;
    // base64 = canvas.toDataURL("image/png").split(';base64,')[1];
    const file = dataURLtoBlob(canvas.toDataURL("image/jpeg", 0.7));
    form.append("title", title);
    form.append("text", text);
    form.append('image', file);
return form;
}


continu.addEventListener('click', async () => {
    const form = createForm();
    const reply = await axios.post('https://postcardsapi.herokuapp.com/api/v1/postcards/crt', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    console.log(reply);
    window.location.href = 'index.html';
    
})

reset.addEventListener('click', () => {
    window.location.reload();
})


//for file download

// canvas.toBlob(
    // const anchor = document.querySelector('.download');
    //     blob => {
    //         // console.log(blob);
    //         // anchor.href = URL.createObjectURL(blob);
    //         // const fileData = blob;

    //         form.append("blob", blob);
          
    //     },
    //     'image/jpeg',
    //     0.9,
    // );