
const form = document.querySelector("form");
const loadingGif = document.querySelector('.loading');
const wishesElement = document.querySelector('.wishes');
const errorElement = document.querySelector('.error-message');
const loadMoreElement = document.querySelector('#loadMore');
const API_URL = window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/v2/wishes' : 'https://flying-penguin-api.muldurozan.now.sh/wishes';

let skip = 0;
let limit = 5;
let loading = false;
let finished = false;

loadingGif.style.display = 'none';

document.addEventListener('scroll', () => {
    const rect = loadMoreElement.getBoundingClientRect();
    if (rect.top < window.innerHeight && !loading && !finished) {
      loadMore();
    }
  });

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
            }
          }).then(response => { 
            console.log(response)     
            if (!response.ok) {
              const contentType = response.headers.get('content-type');
              if (contentType.includes('json')) {
                return response.json().then(error => Promise.reject(error.message));
              } else {
                return response.text().then(message => Promise.reject(message));
              }
            }
          }).then(() => {
            form.reset();
            setTimeout(() => {
              form.style.display = '';
            }, 30000);
            listAllMews();
          }).catch(errorMessage => {
            form.style.display = '';
            errorElement.textContent = errorMessage;
            errorElement.style.display = '';
            loadingGif.style.display = 'none';
          });
        } else {
          errorElement.textContent = 'Name and content are required!';
          errorElement.style.display = '';
        }
      });
        
function loadMore() {
            skip += limit;
            listAllWishes(false);
          }


function listAllWishes(reset = true){
    loading = true;
    if (reset) {
        wishesElement.innerHTML = '';
        skip = 0;
        finished = false;
      }
    fetch(`${API_URL}?skip=${skip}&limit=${limit}`)
        .then((response) => response.json())        
        .then(result => {
            console.log(result);
            
            result.wishes.forEach(wish => {
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

            })
            loadingGif.style.display = 'none';
            if (!result.meta.has_more) {
                loadMoreElement.style.visibility = 'hidden';
                finished = true;
              } else {
                loadMoreElement.style.visibility = 'visible';
              }
              loading = false;
        })
}
