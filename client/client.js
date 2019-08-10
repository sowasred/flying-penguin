
const form = document.querySelector("form");
const loadingGif = document.querySelector('.loading');
const wishesElement = document.querySelector('.wishes');
const API_URL = 'https://flying-penguin-api.muldurozan.now.sh/wishes';


loadingGif.getElementsByClassName.display = 'none';

listAllWishes();


form.addEventListener('submit', (event) =>{
    event.preventDefault();
    const name = document.querySelector('#name').value;
    const content = document.querySelector('#content').value;
    

    const wishData = {
        name,
        content
    };
    
    form.style.display = 'none'
    loadingGif.style.display = ''
    
    fetch(API_URL, {
        method: 'POST',
        body: wishData.json(),
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
        .then((response) => {response.json()
        console.log(response)})
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
