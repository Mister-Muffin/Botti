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
    <div class="center">
      <h1 class="subtitle, green">Rangliste</h1>
      <div id="leaderboard">
        <li id="leaderboardListItem">
          <span>Plazierung</span>
          <span style="width: 40%;">Name</span>
          <span>Erfahrung</span>
          <span>Nachrichten</span>
        </li>
        <li id="leaderboardListItem" v-for="(item, index) in leaderboard" :key="item">
          <span>{{ index + 1 }}</span>
          <span style="width: 40%;">{{ item.Username }}</span>
          <span>{{ item.Xp }} xp</span>
          <span>NaN</span>
        </li>
      </div>
    </div>
  </main>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  padding-bottom: 30px;
}

#boxes {
  width: inherit;
  height: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 30px;
}

#leaderboard {
  width: 50%;
  min-height: 200px;
  border-radius: 10px;
  border: solid hsl(var(--default-background-hue), var(--default-background-sat), 16%) 2px;
  padding: 10px 0 10px 0;
  background-color: hsl(var(--default-background-hue), var(--default-background-sat), 18%);
}

#leaderboard span {
  padding-left: 15px;
  padding-right: 15px;
}

#leaderboardListItem {
  padding: 5px 0 5px 0;
  font-size: large;
  cursor: default;
  background-color: hsl(var(--default-background-hue), var(--default-background-sat), 22%);
  border: solid rgba(0, 0, 0, 0) 10px;
  border-radius: 10px;
  transition: background-color 0.8s;
  list-style: none;
  margin-left: 1em;
  margin-right: 1em;
  margin-bottom: 0.5em;
  margin-top: 0.5em;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
}

#leaderboardListItem:hover {
  background-color: hsl(var(--default-background-hue), var(--default-background-sat), 25%);
}

.center {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
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
      await fetch("/botti/stats").then(async (res) => {
        const formatter = Intl.NumberFormat('en', { notation: "compact" })

        if (res.status !== 200) {
          console.warn(`${res.status}!`);

          const errorMessage = !navigator.onLine ? "OFFLINE" : "API down!";
          this.ehre, this.alla, this.yeet, this.schaufel = errorMessage;

          return;
        }

        const stats = await res.json();

        this.ehre = `Es wurde schon\n${stats.totals.Ehre}\nmal Ehre generiert`;
        this.alla = `Es wurde insgesamt\n${stats.totals.Alla}\nmal alla gesagt`;
        this.yeet = `Es wurde sich schon\n${stats.totals.Yeet}\nmal weggeyeetet`;
        this.schaufel = `Es wurden\n${stats.totals.Schaufel}\nSchaufeln gegen Köpfe geschlagen`;

        var tmp = []

        //console.log(stats.ids.toString())
        //console.log(JSON.parse(stats.ids.toString()))
        //console.warn(stats.ids)
        for (const [key, value] of Object.entries(stats.ids)) {
          tmp.push(value);
        }
        tmp.sort((a, b) => {
          return -(a.Xp - b.Xp);
        });
        this.leaderboard = []
        tmp.forEach(element => {
          if (element.Xp != 0 && element.Username !== null) {
            element.Xp = formatter.format(element.Xp)
            this.leaderboard.push(element)
          }
        });
      }).catch((e) => {
        const errorMessage = !navigator.onLine ? "OFFLINE" : "API down!";
        this.ehre = errorMessage;
        this.alla = errorMessage;
        this.yeet = errorMessage;
        this.schaufel = errorMessage;
        this.leaderboard.push(e)
      });
    },
    loop: function () {
      this.loadData()
      setTimeout(this.loop, 2000);
    }
  },
  mounted: function () {
    console.info("Data")
    this.loadData()
    console.info("Loop")
    this.loop()
  }

}
</script>