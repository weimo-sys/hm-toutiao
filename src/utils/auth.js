const USER_TOKEN = 'heima-toutiao-91'
export default {
  setUser (user) {
    localStorage.setItem(USER_TOKEN, JSON.stringify(user))
  },
  getUser () {
    return JSON.parse(localStorage.getItem(USER_TOKEN) || '{}')
  },
  delUser () {
    localStorage.removeItem(USER_TOKEN)
  }
}
