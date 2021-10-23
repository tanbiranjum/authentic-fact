import { login, logout } from './login'

const loginForm = document.querySelector('.form--login')
//const signupForm = document.querySelector('.form--signup')
//const logOutBtn = document.querySelector('.nav__el--logout')

//if loginForm element is on page then run loginForm function
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
  })
}
