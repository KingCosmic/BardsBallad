import decode from 'jwt-decode'

import { Character, User } from '../types'

class ApiService {
  domain: string

  // Initializing important variables
  constructor() {
    // API server url
    this.domain = 'https://api-ftdzf.ondigitalocean.app'

    this.fetch = this.fetch.bind(this)
    this.loadCharacters = this.loadCharacters.bind(this)
    this.loadCharacter = this.loadCharacter.bind(this)
    this.login = this.login.bind(this)
    this.signup = this.signup.bind(this);
  }

  updateCharacter(id: string, data: object) {
    return this.fetch(`${this.domain}/characters/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        data
      })
    })
  }

  syncCharacters(characters: Character[]) {
    return this.fetch(`${this.domain}/characters/sync`, {
      method: 'POST'
    })
  }

  loadCharacters() {
    return this.fetch(`${this.domain}/characters`, {
      method: 'GET'
    })
  }

  loadCharacter(id) {
    return this.fetch(`${this.domain}/characters/${id}`, {
      method: 'GET'
    })
  }

  login(email: string, password: string) {
    // Get a token from api server using the fetch api
    return this.fetch(`${this.domain}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    }).then(res => {
      this.setToken(res.token) // Setting the token in localStorage
      return Promise.resolve(this.decodeToken(res.token));
    })
  }

  signup(email: string, password: string) {
    // Get a token from api server using the fetch api
    return this.fetch(`${this.domain}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    }).then(res => {
      this.setToken(res.token) // Setting the token in localStorage
      return Promise.resolve(this.decodeToken(res.token));
    })
  }

  isLoggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken() // Getting token from localstorage
    return !!token && !this.isTokenExpired(token) // handwaiving here
  }

  decodeToken(token:string):User {
    return decode(token)
  }

  isTokenExpired(token:string) {
    try {
      const decoded = this.decodeToken(token)

      // @ts-ignore
      return (decoded.exp > Date.now() / 1000)

    } catch (err) {
      return false
    }
  }

  setToken(idToken: string) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  getToken() {
    // Retrieves the user token from localStorage
    if (typeof window !== `undefined`) {
      return localStorage.getItem('id_token')
    }
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token')

    return Promise.resolve(true)
  }

  getProfile() {
    try {
      return this.decodeToken(this.getToken())
    } catch (err) {
      return undefined
    }
  }


  async fetch(url: string, options: object) {
    // performs api calls sending the required authentication headers
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.isLoggedIn()) {
      headers['Authorization'] = 'Bearer ' + this.getToken()
    }

    return fetch(url, {
      headers,
      ...options
    })
    .then(this._checkStatus)
    .then((response: Response) => response.json())
  }

  _checkStatus(response: Response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
      return response
    } else {
      console.log(response)
      
      var error = new Error(response.toString())
      throw error
    }
  }
}

export default new ApiService()