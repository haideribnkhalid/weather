const form = document.querySelector('#search-form')
const input = document.querySelector('#search-term')
const msg = document.querySelector('.form-msg')
const list = document.querySelector('.cities')

//API key
const apiKey = 'b1e7de47a48b98616df53cdf16fec6b5';

form.addEventListener('submit', e=>{
    e.preventDefault();

    msg.textContent = ''
    msg.classList.remove('visible')

    let inputVal = input.value

    //check if there's already a city that matches the search criteria
    const listItemsArray = Array.from(list.querySelectorAll('.cities li'))

    if(listItemsArray.length > 0){
        const filteredArray = listItemsArray.filter(el =>{
            let content = ''
            let cityName = el.querySelector('.city_name').textContent.toLowerCase()
            let cityCountry = el.querySelector('.city_country').textContent.toLowerCase()

            // check for the <city,country> format
            if(inputVal.includes(',')){
                if(inputVal.split(',')[1].length >2){
                    inputVal = input.split(',')[0]

                    content = cityName
                }else{
                    content = `${cityName},${cityCountry}`
                }
            }else{
                content = cityName
            }
            return content == inputVal.toLowerCase()
        })

        if(filteredArray.length > 0){
            msg.textContent = `You already know the weather for ${filteredArray[0].querySelector('.city_name').textContent} ...otherwise be more specific by providing the country code as well 😉`;
            msg.classList.add('visible')

            form.reset()
            input.focus()

            return
        }
    }

    //AJAX magic
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`

    fetch(url)
        .then(response => response.json())
        .then(data => {
            

            if(data.cod == '404'){
                throw new Error(`${data.cod}, ${data.message}`)
            }

            const {main, name, sys, weather} = data

            const icon = `img/weather/${weather[0]['icon']}.svg`;
            const li = document.createElement('li')

            const markup = `
            <figure><img src="${icon}" alt="${weather[0]['description']}"></figure>

                    <div>
                        <h2>${Math.round(main.temp)} <sup>&deg;C</sup></h2>
                        <p class="city_conditions">${weather[0]['description'].toUpperCase()}</p>
                        <h3><span class="city_name">${name}</span><span class="city_country">${sys.country}</span></h3>
                    </div>
            `
            li.innerHTML = markup
            list.appendChild(li)
            form.reset()
            input.focus()

        })
        .catch(() => {
            msg.textContent = 'Please search for a valid city!'
            msg.classList.add('visible')
        })
})