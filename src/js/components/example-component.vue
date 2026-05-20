<template>
  <div class="max-w-md">
    <div v-if="this.flippedCards.length < 8" class="flex flex-wrap -m-[5px]">
      <div
        v-for="(card, index) in this.cardsData"
        :key="index"
        @click="this.toggleCard(index)"
        :class="{ 'flipped shadow-md scale-105': this.flippedCards.includes(index) }"
        class="hover:scale-95 transition-all rounded-md overflow-hidden relative m-[5px] w-[calc(33.3%-10px)] pb-[calc(33.3%-10px)] cursor-pointer"
      >
        <div class="absolute inset-0 flex items-center justify-center bg-amber-500">
          <div v-if="this.flippedCards.includes(index)" class="card-content">
            <img class="w-full h-auto" :alt="'Card '+card.id" :src="card.imageUrl" />
          </div>
          <div v-else class="card-content text-white font-medium">Open</div>
        </div>
      </div>
    </div>
    <div v-else class="relative w-full pb-full">
      <img
        class="w-full h-auto"
        alt="Winner card"
        :src="'https://img.freepik.com/premium-vector/you-win-lettering-pop-art-text-banner_185004-60.jpg?w=900'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Card {
  id: number;
  imageUrl: string;
}

export default defineComponent({
  data() {
    return {
      flippedCards: [] as number[],
      cardsData: [] as Card[],
    };
  },
  mounted() {
      this.cardsData = this.generateCardsData();
  },
  methods: {
    generateCardsData(): Card[] {
      const data: Card[] = [];

      for (let i = 1; i <= 4; i++) {
        const id = i;
        const imageUrl = `https://picsum.photos/500?id=${i}`;

        const card: Card = { id, imageUrl };
        data.push(card);

        const duplicateCard: Card = { id, imageUrl };
        data.push(duplicateCard);
      }

      const specialCard: Card = {
        id: 5,
        imageUrl:
          "https://img.freepik.com/free-vector/oops-vector-text-comic-font-typography_53876-162000.jpg?size=338&ext=jpg&ga=GA1.1.1546980028.1704326400&semt=sph",
      };
      data.push(specialCard);

      this.shuffleArray(data);

      return data;
    },
    shuffleArray(array: Card[]): void {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },
    toggleCard(index: number): void {
      this.flippedCards.push(index);

      const previousIndex = this.flippedCards[this.flippedCards.length - 2];
      const previousCard = this.cardsData[previousIndex];
      const currentCard = this.cardsData[index];

      if (currentCard.id === 5) {
        setTimeout(() => {
          this.flippedCards = [];
        }, 500);
      } else if (this.flippedCards.length % 2 === 0) {
        if (previousCard.id !== currentCard.id) {
          setTimeout(() => {
            this.flippedCards = [];
          }, 1000);
          return;
        }
      }
    },
  },
});
</script>