<template>
    <div>
      <v-row>
        <v-card class="pa-2 ml-15 mr-15 mt-5" width="84%" >
          <br />
          <v-row class="ml-1">
            <v-card-title>{{ username }}</v-card-title>
            <add-as-friend v-if="user != userId" :user="user" />
          </v-row>
          <v-container fluid>
            <v-row dense>
              <v-col :cols="4">
                <v-card class="mr-10" max-width="400"  >
                  <v-img
                    :src="avatar"
                  ></v-img>
                </v-card>
              </v-col>
              <v-col :cols="8">
                <my-statistics :user="user" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <my-friends :user="user" />
        <my-matches :user="user" />
        <my-achievements :user="user" />
      </v-row>
    </div>
  </template>
  
  <script lang="ts">
  import MyFriends from '@/components/Profile/MyFriends.vue';
  import AddAsFriend from '@/components/Profile/AddAsFriend.vue';
  import MyAchievements from '@/components/Profile/MyAchievements.vue';
  import MyMatchHistory from '@/components/Profile/MyMatchHistory.vue';
  import MyStatistics from '@/components/Profile/MyStatistics.vue';
  import { UserDto } from '@/dtos/users';
  import { defineComponent } from 'vue';
  import { mapGetters } from 'vuex';
  import axios from 'axios';
  
  interface Users {
    users: Map<number, UserDto>;
    username: string,
    avatar: string,
    idOther: number,
    userId: string,
    count: number,
  }
  
  export default defineComponent({
    data(): Users {
      return {
        users: new Map(),
        username: '',
        avatar: '',
        idOther: 0,
        userId: '',
        count: 0,
      };
    },
    props: ['user'],
    components: {
      "my-friends": MyFriends,
      'add-as-friend': AddAsFriend,
      "my-achievements": MyAchievements,
      "my-matches": MyMatchHistory,
      "my-statistics": MyStatistics,
    },
    methods: {
      ...mapGetters(['id']),
    },
    errorCaptured: function(err: any) {
      console.error('Caught error:', err.message, 'the user doesn\'t exist');
      ++this.count;
      return false;
    },
    async created() {
      let responseUs = await axios.get('/users/' + this.id());
      this.userId = (responseUs.data.username);
      let response;
      try { 
        response = await axios.get(`/users/name/${this.user}`);
      } catch {
          this.$router.push('/404');
          return;
      }
      
        this.idOther = response.data.id;
        const newUser: UserDto = response.data;
        this.users.set(this.idOther, newUser);
        this.username = newUser.username;
        this.avatar = await this.$store.dispatch(
          'getAvatarById',
          this.idOther.toString(),
        );
    }
  });
  </script>
