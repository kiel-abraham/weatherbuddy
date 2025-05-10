<script setup>
import { ref, watch } from "vue";
import { actions } from "astro:actions";

const dialog = ref(false);
const location = ref("");
const results = ref([]);
const selectedLocation = ref("");
const friendName = ref("");
const error = ref("");

const searchLocation = async () => {
  results.value = [];
  const { data, error } = await actions.searchLocation(location.value);
  if (error) {
    // Handle the error
    console.error(error);
  } else {
    // Handle the successful response
    results.value = data;
  }
};

const cancel = () => {
  location.value = "";
  selectedLocation.value = "";
  friendName.value = "";
  error.value = "";
  results.value = [];
  dialog.value = false;
};

const save = () => {
  if (!friend.value) {
    error.value = "Please enter a friend's name.";
    return;
  }
  if (!selectedLocation.value) {
    error.value = "Please select a location.";
    return;
  }

  // Save the selected location and friend's name
  console.log("Saving:", {
    friendName: friendName.value,
    selectedLocation: selectedLocation.value,
  });
};

// Watch for changes in friendName or location and reset the error
watch([friendName, location], () => {
  error.value = "";
});

// Watch for changes in results and auto-select if there's only one result
watch(results, (newResults) => {
  if (newResults.length === 1) {
    selectedLocation.value = newResults[0].id;
  }
});
</script>

<template>
  <button @click="dialog = true" type="button" class="btn btn-primary">
    Add new
  </button>

  <div
    v-if="dialog"
    class="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modalTitle"
  >
    <div class="w-full sm:min-w-md max-w-lg rounded-lg bg-white p-6 shadow-lg">
      <div class="flex items-start justify-between">
        <h2 id="modalTitle" class="text-xl font-bold text-gray-900 sm:text-2xl">
          Add New Location
        </h2>

        <button
          @click="cancel"
          type="button"
          class="-me-4 -mt-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="mt-4">
        <!-- <p class="text-pretty text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque euismod, nisi eu consectetur. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p> -->

        <label for="friend">
          <span> Friend's name </span>

          <input v-model="friendName" type="text" id="friend" />
        </label>

        <form @submit.prevent="searchLocation">
          <label for="location">
            <span> Location </span>

            <div class="relative">
              <input
                v-model="location"
                type="text"
                id="location"
                class="input-btn"
              />

              <span
                class="absolute inset-y-0 right-2 grid w-8 place-content-center"
              >
                <button
                  @click="searchLocation"
                  type="button"
                  aria-label="Submit"
                  class="rounded-full p-1.5 text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </span>
            </div>
          </label>
        </form>

        <fieldset v-if="results.length" class="mt-10 space-y-2">
          <legend class="sr-only">Location</legend>

          <div v-for="(result, index) in results" :key="index">
            <label
              :for="result.id"
              class="flex items-center justify-between gap-4 rounded border border-gray-300 bg-white p-3 text-sm font-medium transition-colors hover:bg-gray-50 has-checked:border-blue-600 has-checked:ring-1 has-checked:ring-blue-600"
            >
              <div>
                <p class="text-gray-700">{{ result.name }}</p>
                <p class="text-gray-900">{{ result.country }}</p>
              </div>

              <input
                v-model="selectedLocation"
                type="radio"
                name="locationOption"
                :value="result.id"
                :id="result.id"
                class="size-5 border-gray-300"
              />
            </label>
          </div>
        </fieldset>
      </div>

      <div
        v-if="error"
        role="alert"
        class="mt-4 border-s-4 border-red-700 bg-red-50 p-4"
      >
        <div class="flex items-center gap-2 text-red-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5"
          >
            <path
              fill-rule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clip-rule="evenodd"
            />
          </svg>

          <p>{{ error }}</p>
        </div>
      </div>

      <footer class="mt-6 flex justify-end gap-2">
        <button @click="cancel" type="button" class="btn btn-secondary">
          Cancel
        </button>

        <button @click="save" type="button" class="btn btn-primary">
          Save
        </button>
      </footer>
    </div>
  </div>
</template>
