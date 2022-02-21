//FIRST LOAD STRUCTURE
const postcards = document.querySelector('.postcards');
let imgNodes;

const createElements = (arr) => {
    //remove all child elements from postcards container
    [...postcards.childNodes].forEach(el => el.remove());
    arr.forEach((x) => {
        //create card element and fill up with content
        const card = document.createElement("div");
        card.className = 'card';
        postcards.appendChild(card);
        //delete button
        let rinow = new Date();
        rinow = rinow.getTime();
        if (rinow - x.time < 1800000) {
            const del = document.createElement('p');
            del.className = 'deleteCard';
            del.id = x._id;
            del.dataset.time = x.time;
            del.onclick = deleteCard;
            card.appendChild(del);
        }
        //image element with placeholder image
        const img = document.createElement("img");
        img.src = 'loading.gif';
        img.loading = 'lazy';
        //text elements
        const from = document.createElement("p");
        from.innerHTML = `from <i><strong> ${x.name}</strong></i> on ${x.date}`
        from.className = 'from';
        const h1 = document.createElement("h1");
        h1.innerHTML = x.title;
        const p = document.createElement("p");
        p.innerHTML = x.text;
        p.className = 'text';
        //append all elements as children to the card
        card.append(img, from, h1, p);
        // card.appendChild(from);
        // card.appendChild(h1);
        // card.appendChild(p);
        imgNodes = document.querySelectorAll('img');
        return arr;
    })
}

const getInfos = async () => {
    const infos = await axios.get('https://postcardsapi.herokuapp.com/api/v1/postcards/ftch/nfs');
    return infos.data;
}

//ADD IMAGES


const getImage = async (id, i) => {
    try {
        const response = await axios.get('https://postcardsapi.herokuapp.com/api/v1/postcards/ftch/mg/' + id);
        imgNodes[i].src = 'data:image/jpeg;base64,' + response.data.image.buffer;
    } catch (error) {
        console.error(error);
    }
}

const getImages = (arr) => {
    arr.forEach((x, i) => {
        getImage(x._id, i)
    })

}

const loadStuff = () => {
    getInfos().
        then((r) => {
            createElements(r);
            // getImages(r);
        })
        .catch(err => console.log(err));
}

loadStuff();

//DELETE IMAGE

const deleteCard = async (e) => {
    try {
        const response = await axios.delete('https://postcardsapi.herokuapp.com/api/v1/postcards/del/' + e.target.id);
        if (response) {
            loadStuff();
        }
    } catch (err) {
        console.error(err);
    }

}

setInterval(() => {
    let now = new Date();
    now = now.getTime();
    delNodes = document.querySelectorAll('.deleteCard');
    for (const element of delNodes) {
        if (now - element.dataset.time > 1800000) {
            element.remove();
            return;
        }
    }
}, 60000)


//display loading
//fetch info of how many cards in the collection
//create x elements and attach them to the postcards div
//display them empty/loading with moving gradients
//deletetion functionality
//fetch each postcard individually and attach them to the elements created

//upload different sizes and get only size for screensize
//lazy loading images on scroll

//adding fields name if empty anonymous and timestamp
//css for displaying those and bg style
//delete sure? functionality
//hosting
