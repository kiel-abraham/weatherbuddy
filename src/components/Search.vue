<template>
  <div>
    <form @submit.prevent="test" class="search-container">
      <label for="location-input">Enter Location:</label>
      <input
        id="location-input"
        v-model="location"
        type="text"
        placeholder="Search for a location"
      />
      <button>Search</button>
    </form>
    <div v-if="results.length">
      <h3>Search Results:</h3>
      <ul>
        <li v-for="(result, index) in results" :key="index">
          {{ result.name }}
        </li>
      </ul>
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { actions } from 'astro:actions';

const location = ref("");
const results = ref([]);
const error = ref(null);

const test = () => {
  console.log("Test function called");
};

const searchLocation = async () => {
  console.log("Searching for location:", location.value);
  const { data, error } = await actions.searchLocation(location.value);
  if (error) {
    // Handle the error
    console.error(error);
  } else {
    // Handle the successful response
    console.log(data);
  }
};

</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
}

.error {
  color: red;
  font-weight: bold;
}
</style>