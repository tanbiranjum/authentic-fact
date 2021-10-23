import axios from 'axios'

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/user/login',
      data: {
        email,
        password,
      },
    })

    if (res.data.status === 'success') {
      alert('Logged in successfully')
      //when logged in, load the home page after 1 and a half seconds
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  } catch (err) {
    alert(err.response.data.message)
  }
}

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/user/logout',
    })

    if (res.data.status === 'success') {
      location.reload()
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.')
  }
}
