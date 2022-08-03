import { User } from 'firebase/auth'
import Vue from 'vue'
import Vuex from 'vuex'
import { cacheAllSongs, createSong, login } from './firebase'

export interface Song{
  text: string
  name: string
  youtube?: string
  author: string
  id: number
  path: string
}

Vue.use(Vuex)

interface IState {
  darkTheme: boolean
  guitarMode: boolean
  columnCount: number
  fontSize: number
  songs: Song[]
  isMobile: boolean
  credential: User | undefined
  isAdmin: boolean
  liked: Set<number>
}

function isMobile ():boolean {
  return navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) != null
}

export default new Vuex.Store<IState>({
  state: {
    darkTheme: false,
    guitarMode: false,
    songs: [],
    columnCount: 1,
    fontSize: 12,
    isMobile: false,
    credential: undefined,
    isAdmin: false,
    liked: new Set<number>()
  },
  getters: {
  },
  mutations: {
    initialize (state) {
      const prefs: IState = JSON.parse(localStorage.getItem('preferences') || '{}')
      state.guitarMode = prefs.guitarMode || true
      state.darkTheme = prefs.darkTheme || window.matchMedia('(prefers-color-scheme: dark)').matches
      state.columnCount = prefs.columnCount || 1
      state.fontSize = prefs.fontSize || 12
      state.liked = new Set<number>(prefs.liked as unknown as number[])
      state.isMobile = isMobile()
      state.songs = JSON.parse(localStorage.getItem('songs') || '[]')
    },
    save (state, saveSongs: boolean) {
      console.log('saving')

      const data = Object.assign({}, {
        darkTheme: state.darkTheme,
        guitarMode: state.guitarMode,
        columnCount: state.columnCount,
        fontSize: state.fontSize,
        liked: [...state.liked]
      })
      localStorage.setItem('preferences', JSON.stringify(data))
      if (saveSongs) { localStorage.setItem('songs', JSON.stringify(state.songs)) }
    },
    setDarkTheme (state, darkTheme: boolean) {
      state.darkTheme = darkTheme
    },
    setGuitarMode (state, guitarMode: boolean) {
      state.guitarMode = guitarMode
    },
    setFontSize (state, fontSize: number) {
      state.fontSize = fontSize
    },
    setColumns (state, columnCount: number) {
      if (!state.isMobile) { state.columnCount = columnCount }
    },
    login (state) {
      login().then((data) => {
        state.credential = data.user
        state.isAdmin = data.admin
      })
    },
    toggleOffline (state) {
      if (state.songs.length > 0) {
        localStorage.removeItem('songs')
        state.songs = []
      } else {
        cacheAllSongs().then(songs => {
          state.songs = songs
        })
      }
    },
    toggleLike (state, id: number) {
      if (state.liked.has(id)) {
        state.liked.delete(id)
      } else {
        state.liked.add(id)
      }
    },
    updateSong (state, song) {
      const index = state.songs.findIndex(s => s.id === song.id)
      if (index > -1) {
        state.songs[index] = song
      }
    },
    createSong (state, song: Song) {
      state.songs.push(song)
    }
  },
  actions: {
  },
  modules: {
  }
})