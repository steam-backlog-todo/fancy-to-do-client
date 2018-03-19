Vue.component('input-comp', {
  template: `

  <div class="container ">

    <!-- send form data through vue -->
    <div class="field">
      <label class="label has-text-black">Steamid</label>
      <div class="control has-icons-left">
        <input v-model="steamid" class="input" type="text" name="" placeholder="insert your steamid here...">
        <span class="icon is-small is-left">
          <i class="fas fa-tasks"></i>
        </span>
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" v-on:click="confirmData">Submit</button>
      </div>
      <div class="control">
        <button class="button ">Cancel</button>
      </div>
    </div>

  </div>

  `,
  props: [],
  data: function() {
    return {
      steamid:'',
    }
  },
  methods: {
    confirmData: function() {
      let data = {
        steamid: this.steamid,
      }
      console.log(data)
      this.$emit('newtask', data)
    }
  }
})

Vue.component('steam-comp', {
  template: `

  <div class="container">
    <h1 class="title">Backlog</h1>
    <div class="card" v-for='(task, index) in games' :id="['card-'+index]">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img :src="iconUrl(task.appid, task.img_icon_url)" alt="Placeholder image">
            </figure>
          </div>
          <div class="media-content ">
            <p class="title is-4">{{task.name}}</p>
            <p class="subtitle is-6">Played for: {{Math.floor(task.playtime_forever/60)}} hours</p>
          </div>
        </div>

        <div class="content">

          <div class="level">
            <!-- left side -->
            <div class="level-left">
              <div class="level-item">
                APPID: {{task.appid}}
              </div>
            </div>

            <!-- right side -->
            <div class="level-right">
              <div class="level-item">
                <button class="button" type="button" name="button" v-on:click="newSteamTask(task.name, ['card-'+index])">Add Task</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  `,
  props: ['games'],
  data: function() {
    return {
      hideClass: '',
      card: 'card',
      iconBaseUrl: 'http://media.steampowered.com/steamcommunity/public/images/apps/'
    }
  },
  methods: {
    iconUrl: function(appid, hash) {
      let defUrl = 'https://bulma.io/images/placeholders/96x96.png'
      if (hash.length < 1) {
        return defUrl
      } else {
        let url = this.iconBaseUrl + appid + '/' + hash + '.jpg'
        return url
      }
    },
    newSteamTask: function (title, cardId){
      let data = {
        name: title,
        category: 'Steam Games',
        desc: 'Imported from Steam',
        cardId: cardId
      }
      confirm(`Do you want to add ${title} as a new task?`)
      this.$emit('steam-task', data)
    },
  }
})

let createVue = new Vue({
  el: '#vueApp',
  data: {
    userID: localStorage.getItem('userID'),
    jwtToken: localStorage.getItem('jwtToken'),
    steamGames: ''
  },
  methods: {
    onSubmit: function(data) {
      let send = new FormData()
      send.append('token', this.jwtToken);
      send.append('steamid', data.steamid);
      send.append('userID', this.userID);
      let localhost = 'http://localhost:3000';
      let deploy = 'http://phase-two.teddydevstack.com';
      axios.put(`${deploy}/users/steamid/`, send)
        .then(response => {
          console.log(response);
          // execute secondary steamVue mission!

          // run steam api
          axios.post(`${deploy}/steam/`, send)
            .then(resGames => {
              console.log(resGames);
              // create a new vue
              this.steamGames = resGames.data.games;
              // show vue element
              $('#steamlist').show()

            })

        })
        .catch(err => {
          console.log(err);
        })
    },
    onNewSteamTask: function(data) {
      // console.log(payload);
      let send = new FormData()
      send.append('token', this.jwtToken);
      send.append('name', data.name);
      send.append('category', data.category);
      send.append('desc', data.desc);
      let localhost = 'http://localhost:3000';
      let deploy = 'http://phase-two.teddydevstack.com';
      axios.post(`${deploy}/tasks/add/${this.userID}`, send)
        .then(response => {
          console.log(response);
          // window.location.href = '#';
          $(`#${data.cardId}`).hide(1000)
        })
        .catch(err => {
          console.log(err);
        })
    }
  }
})
