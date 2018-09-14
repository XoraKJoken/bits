const express = require('express');
const router = express.Router();

/* GET Index */
router.get('/', (req, res, next) => {
  if (!localStorage.getItem('firstName')) {
    res.render('index', {
      title: 'Bits - The Game',
      backgroundColor: '#262a42',
      fontColor: '#c7cce6',
    });
  } else {
    res.redirect('/home');
  }
});

/* GET Home */
router.get('/home', (req, res, next) => {
  console.log(`You are ${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}. You are ${localStorage.getItem('age')} years old. Currently you TV's state is ${localStorage.getItem('tv')} and your laptops is ${localStorage.getItem('laptop')}`);
  let tvState;
  let laptopState;
  if (localStorage.getItem('tv') == 'true') {
    tvState = true;
  } else {
    tvState = false;
  }
  if (localStorage.getItem('laptop') == 'true') {
    laptopState = true;
  } else {
    laptopState = false;
  }
  res.render('index/home', {
    title: 'Home',
    backgroundColor: '#262a42',
    fontColor: '#c7cce6',
    firstName: localStorage.getItem('firstName'),
    lastName: localStorage.getItem('lastName'),
    age: localStorage.getItem('age'),
    tv: localStorage.getItem('tv'),
    tvState: tvState,
    laptop: localStorage.getItem('laptop'),
    laptopState: laptopState,
  });
});

/* POST - Create Player */
router.post('/create-player', (req, res, next) => {
  localStorage.setItem('firstName', req.body.firstName);
  localStorage.setItem('lastName', req.body.lastName);
  localStorage.setItem('age', req.body.age);
  localStorage.setItem('tv', false);
  localStorage.setItem('laptop', false);
  res.redirect('/home');
});

/* POST - HOME */
router.post('/home/:key/:value', (req, res, next) => {
  localStorage.setItem(req.params.key, req.params.value);
  res.redirect('/home');
});

module.exports = router;
