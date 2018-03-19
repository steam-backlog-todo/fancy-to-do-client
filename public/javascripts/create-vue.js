Vue.component('input-comp', {
  template: `

  <div class="container ">

    <!-- send form data through vue -->
    <div class="field">
      <label class="label has-text-white">Name</label>
      <div class="control has-icons-left">
        <input v-model="name" class="input" type="text" name="" placeholder="Your task name here...">
        <span class="icon is-small is-left">
          <i class="fas fa-tasks"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <label class="label has-text-white">Category</label>
      <div class="control has-icons-left">
        <input v-model="category" class="input" type="text" name="" placeholder="What is the category?">
        <span class="icon is-small is-left">
          <i class="fas fa-question-circle"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <label class="label has-text-white">Description</label>
      <div class="control">
        <textarea v-model="description" class="textarea" placeholder="Describe your task"></textarea>
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
      name:'',
      category: '',
      description: ''
    }
  },
  methods: {
    confirmData: function() {
      let data = {
        name: this.name,
        category: this.category,
        description: this.description
      }
      console.log(data)
      this.$emit('newtask', data)
    }
  }
})

let createVue = new Vue({
  el: '#vueApp',
  data: {
    userID: localStorage.getItem('userID'),
    jwtToken: localStorage.getItem('jwtToken'),
    localhost: 'http://localhost:3000',
    deploy: 'http://phase-two.teddydevstack.com'
  },
  methods: {
    onSubmit: function(data) {
      let send = new FormData()
      send.append('token', this.jwtToken);
      send.append('name', data.name);
      send.append('category', data.category);
      send.append('desc', data.description);
      axios.post(`${this.deploy}/tasks/add/${this.userID}`, send)
        .then(response => {
          console.log(response);
          // window.location.href = '#';
        })
        .catch(err => {
          console.log(err);
        })
    }
  }
})
