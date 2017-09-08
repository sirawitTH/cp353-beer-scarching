const beerAPI = `https://api.punkapi.com/v2/beers`
const getAll = () => {
    return fetch(`${beerAPI}`)
        .then(response => response.json())
        .catch(error => error)
}
const get = (id) => {
    return fetch(`${beerAPI}/${id}`)
        .then(response => response.json())
        .catch(error => error)
}
const getByParam = (param) => {
    return fetch(`${beerAPI}/?${param}`)
        .then(response => response.json())
        .catch(error => error)
}

const card = (beer) => {
    return `
<div class="card" style="min-width: 250px; height: fit-content; margin-bottom: 10px">
    <img class="card-img-top" src="${beer.image_url}" style="max-width: 50px; padding-top: 20px; margin:auto;">
    <div class="card-body">
        <h4 class="card-title">${beer.name}</h4>
        <p class="card-text">${beer.description}</p>
        <a href="#" class="btn btn-primary float-right" data-toggle="modal" data-target="#showDetail" onclick="showDetail(${beer.id})">More Detail</a>
    </div>
</div>
`
}

const showDetail = (id) => {
    get(id).then(beers => {
        const beer = beers[0]
        document.getElementById(`beer-name`).innerText = beer.name
        let foodList = ''
        for (let food of beer.food_pairing) {
            foodList += `<li>${food}</li>`
        }
        document.getElementById(`beer-content`).innerHTML = `
        <div class="text-center">
            <img src="${beer.image_url}" style="max-height: 150px;">
        </div>
        <p style="text-indent: 50px;">${beer.description}</p>
        <p><b>Tagline</b>: ${beer.tagline}</p>
        <p><b>First Brewed</b>: ${beer.first_brewed}</p>
        <p><b>Yeast</b>: ${beer.ingredients.yeast}</p>
        <p><b>Food Pairing</b>:</p>
        <ul>${foodList}</ul>
        <p><b>Brewers Tips</b>: ${beer.brewers_tips}</p>
        `
    })
}

const showResult = (beers) => {
    let cards = '';
    for (let beer of beers) {
        cards += card(beer)
    }
    document.getElementById(`show-result`).innerHTML = cards
}

const search = () => {
    let inputText = ''
    let selectedBrewed = ''
    let inputBrewedDate = ''
    inputText = document.getElementById(`inputText`).value;
    selectedBrewed = document.getElementById(`brewed`).value
    inputBrewedDate = document.getElementById(`input-brewed-date`).value
    if (!inputText) {
        if (inputBrewedDate) {
            const param = /[0-9]{2}-[0-9]{4}/g.exec(inputBrewedDate)[0]
            if (!param) {
                getAll().then(beers => showResult(beers))
                return
            }
            if (selectedBrewed === 'be') {
                getByParam(`brewed_before=${param}`).then(beers => showResult(beers))
            } else {
                getByParam(`brewed_after=${param}`).then(beers => showResult(beers))
            }
        }
    } else {
        let param = ''
        if (inputBrewedDate) {
            const paramDate = /[0-9]{2}-[0-9]{4}/g.exec(inputBrewedDate)[0]
            if (!paramDate) {
                getAll().then(beers => showResult(beers))
                return
            }
            const select = selectedBrewed === 'be' ? 'brewed_before=' : 'brewed_after='
            param = inputText.trim().split(' ').join('_').concat(`&${select}=${paramDate}`)
        } else {
            param = inputText.trim().split(' ').join('_')
        }
        let beers = [];
        getByParam(`beer_name=${param}`)
            .then(b => beers.push(b))
            .then(() => {
                getByParam(`yeast=${param}`).then(b => beers.push(b))
                    .then(() => {
                        getByParam(`food=${param}`).then(b => beers.push(b))
                            .then(() => {
                                let result = []
                                for (let arr of beers) {
                                    for (let b of arr) {
                                        let unique = true;
                                        for (let i = 0; i < result.length; i++) {
                                            if (result[i].id == b.id) {
                                                unique = false
                                                break
                                            }
                                        }
                                        if (unique) {
                                            result.push(b)
                                        }
                                    }
                                }
                                showResult(result)
                            })
                    })
            })
    }
}

getAll().then(beers => {
    showResult(beers)
})