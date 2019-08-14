
const form = document.querySelector("form");
const loadingGif = document.querySelector('.loading');
const wishesElement = document.querySelector('.wishes');
const errorElement = document.querySelector('.error-message');
const goodbye = document.querySelector('.goodbye')
const API_URL = window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/v2/wishes' : 'https://flying-penguin-api.muldurozan.now.sh/wishes';



loadingGif.style.display = 'none';



listAllWishes();

form.addEventListener('submit', (event) =>{
    event.preventDefault();
    const name = document.querySelector('#name').value;
    const content = document.querySelector('#content').value;   

    if(name.trim() && content.trim()){

        errorElement.style.display = 'none';
        form.style.display = 'none';
        loadingGif.style.display = '';

        const wish = {
            name,
            content
        };

        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(wish),
            headers: {
              'content-type': 'application/json'
            },            
          }
          ).catch(errorMessage => {
            errorElement.textContent = errorMessage;
            errorElement.style.display = '';
            loadingGif.style.display = 'none';
          });
        } else {
          errorElement.textContent = 'Please Fill Name and Your Wish Before Sending.';
          errorElement.style.display = '';
        }
        console.log('why')

        listAllWishes();
        goodbye.textContent = "You can only wish a day. See you tomorrow, Flying Penguin Bless You!"
        goodbye.style.display = 'flex';  
        
      });


function listAllWishes(){   
      goodbye.style.display= 'none'

        wishesElement.innerHTML = '';
      
    fetch(API_URL)
        .then((response) => response.json())        
        .then(result => {
            result.forEach(wish => {
              console.log("hey");
              
                const div = document.createElement('div');
                div.classList.add('notes');
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

            })
            loadingGif.style.display = 'none';
       
        })
}
