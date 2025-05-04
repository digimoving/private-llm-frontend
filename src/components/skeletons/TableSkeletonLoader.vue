<template>
  <div class="mt-8 flow-root animate-pulse">
    <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle">
        <div
          class="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg"
        >
          <div class="overflow-y-auto max-h-[calc(100vh-12rem)]">
            <table class="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    v-for="i in columnCount"
                    :key="i"
                    scope="col"
                    :class="[
                      'sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter',
                      i === 1 ? 'pl-4 pr-3 sm:pl-6 lg:pl-8' : 'px-3',
                      i === columnCount
                        ? 'relative pr-4 pl-3 sm:pr-6 lg:pr-8'
                        : '',
                    ]"
                  >
                    <div class="h-4 bg-gray-200 rounded w-20"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in rowCount" :key="row">
                  <td
                    v-for="col in columnCount"
                    :key="col"
                    :class="[
                      'whitespace-nowrap py-4 text-sm',
                      col === 1 ? 'pl-4 pr-3 sm:pl-6 lg:pl-8' : 'px-3',
                      col === columnCount
                        ? 'relative pr-4 pl-3 sm:pr-6 lg:pr-8'
                        : '',
                      row !== rowCount ? 'border-b border-gray-200' : '',
                    ]"
                  >
                    <div
                      class="h-4 bg-gray-200 rounded"
                      :class="[col === 1 ? 'w-32' : 'w-20']"
                    ></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    columnCount?: number;
    rowCount?: number;
  }>(),
  {
    columnCount: 5,
    rowCount: 5,
  }
);
</script>
