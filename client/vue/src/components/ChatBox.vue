<template>
  <div class="chat-box">
    <header v-on:click="expand()">
      <h2 v-bind:class="{ 'yellow': hasUnread }">Game Chat ({{unread}})</h2>
    </header>
    <div class="chat" v-show="expanded" @submit.prevent>
      <div class="chat-text-area" ref="textArea">
        <div v-if="messages.length" v-for="message in messages">
          <span>{{message && message.username}}: {{message && message.text}}</span>
        </div>
      </div>
      <form>
        <input @keyup.enter="onSubmit" type="text" placeholder="Type your message..." v-model="currentMessage" autofocus maxlength="2000"></input>
      </form>
    </div>
  </div>
</template>
<script>
import { get, find, debounce } from 'lodash-es';
import { mapActions, mapState } from 'vuex';
import { CHAT_MESSAGE } from '../events';

export default {
  name: 'ChatBox',
  data() {
    return {
      expanded: false,
      currentMessage: null,
      focused: true,
      unread: 0,
    };
  },
  computed: {
    ...mapState('game', { messages: state => state.messages }),
    oldMessageCount() {
      return this.messages.length;
    },
    hasUnread() {
      return this.unread > 0;
    },
  },
  methods: {
    ...mapActions('game', [CHAT_MESSAGE]),
    onSubmit(event) {
      if (event.code === 'Enter') {
        this[CHAT_MESSAGE](this.currentMessage);
        this.currentMessage = null;
      }
    },
    expand() {
      this.expanded = !this.expanded;
      if(this.expanded) {
        this.unread = 0;
      }
    },
  },
  watch: {
    messages: function(val, oldVal){
      if (val.length > oldVal.length && !this.expanded) {
        this.unread++;
      }
    }
  },
  updated: function() {
    this.$refs.textArea.scrollTop = this.$refs.textArea.scrollHeight;
  }
};
</script>
<style scoped lang="scss">
@import '../assets/variables.scss';
.chat-box {
  font-weight: normal;
  bottom: 0;
  left: 24px;
  position: fixed;
  z-index: 150;
  width: 300px;
  font-size: 12px;
  box-shadow: 5px 5px 5px black;
}

.chat-box header {
  background: #293239;
  border-radius: 5px 5px 0 0;
  padding: 5px 12px;
  cursor: pointer;
  font-weight: normal;
}

.chat-box header:hover {
  background: #222222;
}

.chat {
  position: relative;
  height: 300px;
  background: #ffffff;
}

.chat-text-area {
  color: black;
  text-shadow: none;
  height: 238px;
  overflow-y: scroll;
}

.chat-text-area div {
  margin: 8px 8px;
}

.chat input[type="text"] {
  border: 1px solid #ccc;
	border-radius: 3px;
	padding: 8px;
	outline: none;
	width: 260px;
  position: absolute;
  bottom: 8px;
  left: 8px;
}

.yellow {
  color: #E5C14E;
}

</style>
