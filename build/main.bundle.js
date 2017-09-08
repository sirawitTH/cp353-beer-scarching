'use strict';

var beerAPI = 'https://api.punkapi.com/v2/beers';
var getAll = function getAll() {
    return fetch('' + beerAPI).then(function (response) {
        return response.json();
    }).catch(function (error) {
        return error;
    });
};
var get = function get(id) {
    return fetch(beerAPI + '/' + id).then(function (response) {
        return response.json();
    }).catch(function (error) {
        return error;
    });
};
var getByParam = function getByParam(param) {
    return fetch(beerAPI + '/?' + param).then(function (response) {
        return response.json();
    }).catch(function (error) {
        return error;
    });
};

var card = function card(beer) {
    return '\n<div class="card" style="min-width: 250px; height: fit-content; margin-bottom: 10px">\n    <img class="card-img-top" src="' + beer.image_url + '" style="max-width: 50px; padding-top: 20px; margin:auto;">\n    <div class="card-body">\n        <h4 class="card-title">' + beer.name + '</h4>\n        <p class="card-text">' + beer.description + '</p>\n        <a href="#" class="btn btn-primary float-right" data-toggle="modal" data-target="#showDetail" onclick="showDetail(' + beer.id + ')">More Detail</a>\n    </div>\n</div>\n';
};

var showDetail = function showDetail(id) {
    get(id).then(function (beers) {
        var beer = beers[0];
        document.getElementById('beer-name').innerText = beer.name;
        var foodList = '';
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = beer.food_pairing[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var food = _step.value;

                foodList += '<li>' + food + '</li>';
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        document.getElementById('beer-content').innerHTML = '\n        <div class="text-center">\n            <img src="' + beer.image_url + '" style="max-height: 150px;">\n        </div>\n        <p style="text-indent: 50px;">' + beer.description + '</p>\n        <p><b>Tagline</b>: ' + beer.tagline + '</p>\n        <p><b>First Brewed</b>: ' + beer.first_brewed + '</p>\n        <p><b>Yeast</b>: ' + beer.ingredients.yeast + '</p>\n        <p><b>Food Pairing</b>:</p>\n        <ul>' + foodList + '</ul>\n        <p><b>Brewers Tips</b>: ' + beer.brewers_tips + '</p>\n        ';
    });
};

var showResult = function showResult(beers) {
    var cards = '';
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = beers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var beer = _step2.value;

            cards += card(beer);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    document.getElementById('show-result').innerHTML = cards;
};

var search = function search() {
    var inputText = '';
    var selectedBrewed = '';
    var inputBrewedDate = '';
    inputText = document.getElementById('inputText').value;
    selectedBrewed = document.getElementById('brewed').value;
    inputBrewedDate = document.getElementById('input-brewed-date').value;
    if (!inputText) {
        if (inputBrewedDate) {
            var param = /[0-9]{2}-[0-9]{4}/g.exec(inputBrewedDate);
            if (!param) {
                getAll().then(function (beers) {
                    return showResult(beers);
                });
                return;
            }
            if (selectedBrewed === 'be') {
                getByParam('brewed_before=' + param[0]).then(function (beers) {
                    return showResult(beers);
                });
            } else {
                getByParam('brewed_after=' + param[0]).then(function (beers) {
                    return showResult(beers);
                });
            }
        } else {
            getAll().then(function (beers) {
                return showResult(beers);
            });
            return;
        }
    } else {
        var _param = '';
        if (inputBrewedDate) {
            var paramDate = /[0-9]{2}-[0-9]{4}/g.exec(inputBrewedDate);
            if (paramDate) {
                var select = selectedBrewed === 'be' ? 'brewed_before=' : 'brewed_after=';
                _param = inputText.trim().split(' ').join('_').concat('&' + select + '=' + paramDate[0]);
            } else {
                _param = inputText.trim().split(' ').join('_');
            }
        } else {
            _param = inputText.trim().split(' ').join('_');
        }
        var beers = [];
        getByParam('beer_name=' + _param).then(function (b) {
            return beers.push(b);
        }).then(function () {
            getByParam('yeast=' + _param).then(function (b) {
                return beers.push(b);
            }).then(function () {
                getByParam('food=' + _param).then(function (b) {
                    return beers.push(b);
                }).then(function () {
                    var result = [];
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = beers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var arr = _step3.value;
                            var _iteratorNormalCompletion4 = true;
                            var _didIteratorError4 = false;
                            var _iteratorError4 = undefined;

                            try {
                                for (var _iterator4 = arr[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                    var b = _step4.value;

                                    var unique = true;
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].id == b.id) {
                                            unique = false;
                                            break;
                                        }
                                    }
                                    if (unique) {
                                        result.push(b);
                                    }
                                }
                            } catch (err) {
                                _didIteratorError4 = true;
                                _iteratorError4 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                        _iterator4.return();
                                    }
                                } finally {
                                    if (_didIteratorError4) {
                                        throw _iteratorError4;
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }

                    showResult(result);
                });
            });
        });
    }
};

getAll().then(function (beers) {
    showResult(beers);
});
