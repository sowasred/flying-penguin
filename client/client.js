
const form = document.querySelector("form");
const loadingGif = document.querySelector('.loading');
const API_URL = 'http://localhost:5000/wish';

loadingGif.getElementsByClassName.display = 'none';

form.addEventListener('submit', (event) =>{
    event.preventDefault();

    const data = FormData(form);
    const name = data.get('name');
    const wish = data.get('wish');

    const wishData = {
        name,
        wish
    };

    form.style.display = 'none'
    loadingGif.style.display = ''
    
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(wishData),
        headers: {
            'content-type': 'application/json'
        }
    })
    


})

