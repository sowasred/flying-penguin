
const form = document.querySelector("form");
const loadingGif = document.querySelector('.loading');
const wishesElement = document.querySelector('.wishes');
const API_URL = 'https://cluster0.muldurozan.now.sh/wishes';


loadingGif.getElementsByClassName.display = '';

listAllWishes();


form.addEventListener('submit', (event) =>{
    event.preventDefault();

    const data = FormData(form);
    const name = data.get('name');
    const content = data.get('content');

    const wishData = {
        name,
        content
    };

    form.style.display = 'none'
    loadingGif.style.display = ''
    
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(wishData),
        headers: {
            'content-type': 'application/json'
        }        
    }).then(response => response.json())
        .then( () => {
            form.reset();   
            setTimeout(() => {
                form.style.display = '';
            }, 20000)

            listAllWishes();
        })
})

function listAllWishes(){
    wishesElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(wishes => {
            wishes.reverse();
            wishes.forEach(wish => {
                const div = document.createElement('div');
                const header = document.createElement('h3');
                header.textContent = wish.name;

                const wishes = document.createElement('p');

                wishes.textContent = wish.content;

                const date = document.createElement('small');
                date.textContent = wish.created;

                div.appendChild(header);
                div.appendChild(wishes);
                div.appendChild(date);

                wishesElement.appendChild(div);

                loadingGif.style.display = 'none'

            })
        })
}
