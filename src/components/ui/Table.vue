<template>
  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle">
        <div
          class="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.key"
                  scope="col"
                  :class="[
                    'py-3.5 text-left text-sm font-semibold text-gray-900',
                    column.key === firstColumn ? 'pl-4 pr-3 sm:pl-6' : 'px-3',
                    column.key === 'actions' ? 'relative' : '',
                  ]"
                >
                  {{ column.key === "actions" ? "" : column.label }}
                  <span v-if="column.key === 'actions'" class="sr-only"
                    >Actions</span
                  >
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="(item, index) in items" :key="index">
                <td
                  v-for="column in columns"
                  :key="column.key"
                  :class="[
                    'whitespace-nowrap py-4 text-sm',
                    column.key === firstColumn ? 'pl-4 pr-3 sm:pl-6' : 'px-3',
                    column.key === 'actions'
                      ? 'relative text-right pr-4 sm:pr-6'
                      : '',
                    typeof column.textColor === 'function'
                      ? column.textColor(item)
                      : column.textColor || 'text-gray-900',
                  ]"
                >
                  <slot :name="column.key" :item="item" :column="column">
                    {{ item[column.key] }}
                  </slot>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string;
  label: string;
  textColor?: string | ((item: any) => string);
}

interface Props {
  columns: Column[];
  items: any[];
}

const props = defineProps<Props>();

// Get the key of the first column for styling purposes
const firstColumn = props.columns[0]?.key;
</script>
