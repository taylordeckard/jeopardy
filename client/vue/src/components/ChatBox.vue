<template>
  <div class="chat-box" v-bind:class="{ 'moveUp': shouldMoveUp }">
    <header v-on:click="expand()">
      <h2 v-bind:class="{ 'text-yellow': hasUnread }">Game Chat ({{unread}})</h2>
    </header>
    <div class="chat" v-bind:class="{ expanded }" @submit.prevent>
      <div v-show="expanded" class="chat-text-area" ref="textArea">
        <div v-show="messages.length" v-for="message in messages" v-bind:key="message.id">
          <span v-bind:class="{ 'text-yellow': username === message.username,
          'text-blue':  username !== message.username}">
            {{message && message.username}}: </span>
          <span v-html="$options.filters.emojify(message.text)"></span>
        </div>
      </div>
      <form v-show="expanded">
        <input @keyup.stop="onSubmit" type="text" placeholder="Type your message..."
        v-model="currentMessage" autofocus maxlength="2000"/>
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { includes } from 'lodash-es';
import { ANSWER, CHAT_MESSAGE, FINAL, FINAL_QUESTION, QUESTION } from '../events';

const moveUpStates = [ANSWER, FINAL, FINAL_QUESTION, QUESTION];

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
    ...mapState('game', { username: state => state.username }),
    ...mapState('game', { game: state => state.game }),
    oldMessageCount() {
      return this.messages.length;
    },
    hasUnread() {
      return this.unread > 0;
    },
    shouldMoveUp() {
      return this.game && includes(moveUpStates, this.game.state);
    },
  },
  methods: {
    ...mapActions('game', [CHAT_MESSAGE, 'getGame', 'subscribeChat', 'unsubscribeChat']),
    onSubmit(event) {
      if (event.code === 'Enter') {
        this[CHAT_MESSAGE](this.currentMessage);
        this.currentMessage = null;
      }
    },
    expand() {
      this.expanded = !this.expanded;
      if (this.expanded) {
        this.unread = 0;
      }
    },
  },
  watch: {
    messages(val, oldVal) {
      if (val.length > oldVal.length && !this.expanded) {
        this.unread = this.unread + 1;
      }
    },
  },
  updated() {
    this.$refs.textArea.scrollTop = this.$refs.textArea.scrollHeight;
  },
  async created() {
    await this.getGame(this.$route.params.id);
    await this.subscribeChat();
    this[CHAT_MESSAGE](':hello');
  },
  async destroyed() {
    this.unsubscribeChat();
  },
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
  box-shadow: 5px 0px 0px rgba(0,0,0,.5);
  transition: bottom .2s;
  &.moveUp {
    bottom: 12px;
  }
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
  height: 0px;
  background: #ffffff;
  transition: height .2s;
  &.expanded {
    height: 300px;
  }
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

</style>
