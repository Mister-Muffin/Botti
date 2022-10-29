<script setup lang="ts">
import TitleText from './components/TitleText.vue'
import StatBox from './components/StatBox.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <TitleText />
    </div>
  </header>

  <main>
    <div id="boxes">
      <StatBox hue=0 :text=ehre />
      <StatBox hue=50 :text=alla />
      <StatBox hue=100 :text=yeet />
      <StatBox hue=200 :text=schaufel />
    </div>
    <div style="min-height: 20px;"></div>
    <h1 class="subtitle, green">Rangliste</h1>
    <div id="leaderboard">
      <ol>
        <li id="leaderboardList" v-for="member in leaderboard">{{ member.Username }}: {{ member.Xp }}xp</li>
      </ol>
    </div>
  </main>
</template>

<style scoped>
#boxes {
  width: inherit;
  height: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}

#leaderboard {
  width: 100%;
  min-height: 200px;
  border-radius: 10px;
  border: solid hsl(133, 76%, 33%) 2px;
  padding: 10px 0 10px 0;
}

#leaderboardList {
  padding: 5px 0 5px 0;
  font-size: large;
}
</style>

<script lang="ts">
export default {
  data() {
    return {
      ehre: "",
      alla: "",
      yeet: "",
      schaufel: "",
      leaderboard: []
    }
  },
  methods: {
    loadData: async function () {
      const res = await fetch("/botti/stats");

      if (res.status !== 200) {
        console.warn(`${res.status}!`);

        const errorMessage = !navigator.onLine ? "OFFLINE" : "API down!";
        this.ehre, this.alla, this.yeet, this.schaufel = errorMessage;

        return;
      }

      const stats = await res.json();
      console.log(stats);

      this.ehre = `Es wurde schon\n${stats.totals.Ehre}\nmal Ehre generiert`;
      this.alla = `Es wurde insgesamt\n${stats.totals.Alla}\nmal alla gesagt`;
      this.yeet = `Es wurde sich schon\n${stats.totals.Yeet}\nmal weggeyeetet`;
      this.schaufel = `Es wurden\n${stats.totals.Schaufel}\nSchaufeln gegen Köpfe geschlagen`;

      var tmp = []

      //console.log(stats.ids.toString())
      //console.log(JSON.parse(stats.ids.toString()))
      //console.warn(stats.ids)
      for (const [key, value] of Object.entries(stats.ids)) {
        console.log(value)
        tmp.push(value);
      }
      tmp.sort((a, b) => {
        return -(a.Xp - b.Xp);
      });
      tmp.forEach(element => {
        if (element.Xp != 0 && element.Username !== null) {
          this.leaderboard.push(element)
        }
      });
    }
  },
  mounted: function () {
    console.info("Data")
    this.loadData()
  }

}
</script>