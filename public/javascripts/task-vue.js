Vue.component('task-comp', {
  template: `

  <div class="container">
    <h1 class="title">Backlog</h1>
    <div class="card" v-for='(task, index) in todo' :id="['card-'+index]">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
            </figure>
          </div>
          <div class="media-content ">
            <p class="title is-4">{{task.name}}</p>
            <p class="subtitle is-6">{{task.category}}</p>
          </div>
        </div>

        <div class="content">
          <div class="level">
            <!-- left side -->
            <div class="level-left">
              <div class="level-item">
              {{task.desc}}
              </div>
            </div>

            <!-- right side -->
            <div class="level-right">

            </div>
          </div>

          <div class="level">
            <!-- left side -->
            <div class="level-left">
              <div class="level-item">
                <span class="tag is-info">Start Date:</span>
              </div>
              <div class="level-item">
                <span class="tag is-light">{{getShortDate(task.createdAt)}}</span>
              </div>
            </div>

            <!-- right side -->
            <div class="level-right">
              <div class="level-item">
                <span class="tag is-danger">{{task.progress}}</span>
              </div>
              <div class="level-item">
              <button class="button" type="button" name="button" v-on:click="updateProgress(task._id, ['card-'+index])">Finish</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  `,
  props: ['todo'],
  data: function() {
    return {
      hideClass: '',
      card: 'card'
    }
  },
  methods: {
    updateProgress: function (id, cardId){
      console.log(id);
      console.log(cardId);
      let data = {
        taskId: id,
        cardId: cardId
      }
      this.$emit('finish', data)
    },
    getShortDate: function(isoDate) {
      let date = new Date(isoDate)
      return date.getDate()+'-' + (date.getMonth()+1) + '-'+ date.getFullYear()
    }
  }
})

Vue.component('completed-comp', {
  template: `

  <div class="container">
    <h1 class="title">Completed</h1>
    <div class="card" v-for='task in done'>
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
            </figure>
          </div>
          <div class="media-content ">
            <p class="title is-4">{{task.name}}</p>
            <p class="subtitle is-6">{{task.category}}</p>
          </div>
        </div>

        <div class="content">
          <div class="level">
            <!-- left side -->
            <div class="level-left">
              <div class="level-item">
              {{task.desc}}
              </div>
            </div>

            <!-- right side -->
            <div class="level-right">


            </div>
          </div>

          <div class="level">
            <!-- left side -->
            <div class="level-left">
              <div class="level-item">
                <span class="tag is-info">Start Date</span>
              </div>
              <div class="level-item">
                <span class="tag is-light">{{getShortDate(task.createdAt)}}</span>
              </div>
            </div>

            <!-- right side -->
            <div class="level-right">
              <div class="level-item">
                <span class="tag is-success">{{task.progress}}</span>
              </div>
              <div class="level-item">
                <span class="tag is-info">{{getShortDate(task.finishedAt)}}</span>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  `,
  props: ['done'],
  data: function() {
    return {
      data: 'aa'
    }
  },
  methods: {
    getShortDate: function(isoDate) {
      if (isoDate === null) {
        return 'Unknown'
      }
      let date = new Date(isoDate)
      return date.getDate()+'-' + (date.getMonth()+1) + '-'+ date.getFullYear()
    }
  }
})


let taskAPI = 'http://teddydevstack.com/tasks/search';
let localhostA  = 'http://localhost:3000/tasks';
let localhostB  = 'http://localhost:3000/tasks/search';
let localhostC  = 'http://localhost:3000/tasks/done';
let retrieved, doneData;


function getBackLog(){
  let send = new FormData()
  send.append('token', localStorage.getItem('jwtToken'))
  return axios.post(localhostB, send)
}
function getDone(){
  let send = new FormData()
  send.append('token', localStorage.getItem('jwtToken'))
  return axios.post(localhostC, send)
}
axios.all([getBackLog(), getDone()])
  .then(axios.spread(function(response, done){
    console.log(response);
    retrieved = response.data.data;
    doneData = done.data.data;

    let taskVue = new Vue({
      el: '#vueApp',
      data: {
        userID: localStorage.getItem('userID'),
        jwtToken: localStorage.getItem('jwtToken'),
        taskData: retrieved,
        doneData: doneData
      },
      methods: {
        updateListen: function(payload) {
          console.log(payload);
          let updateurl = 'http://localhost:3000/tasks/finish'
          let data = new FormData()
          data.append('token', this.jwtToken)
          data.append('userID', this.userID)
          data.append('taskID', payload.taskId)
          console.log('finishing...');
          console.log(data);
          axios.put(updateurl, data).then(response => {
            console.log(response);
            $(`#${payload.cardId}`).hide(1000)
          })
          .catch(err => {
            console.log(err);
          })

        }
      }
    })
}))
.catch(err => {
  console.log(err);
})




// [{name:'1', category:'1',desc:'a'}]
