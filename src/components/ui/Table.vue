<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">{{ heading }}</h1>
        <p class="mt-2 text-sm text-gray-700">{{ subheading }}</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <slot name="button">
          <button
            v-if="buttonLabel"
            type="button"
            class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {{ buttonLabel }}
          </button>
        </slot>
      </div>
    </div>
    <div class="-mx-4 mt-8 sm:-mx-0">
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :scope="'col'"
              :class="column.thClass"
            >
              {{ column.label }}
            </th>
            <th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-0">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="item in items"
            :key="item[rowKey] || item.id || item._id || item.key"
          >
            <td
              class="w-full max-w-0 py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0"
            >
              {{ item[columns[0].key] }}
              <dl class="font-normal lg:hidden">
                <template
                  v-for="(column, colIdx) in columns.slice(1)"
                  :key="column.key"
                >
                  <dt class="sr-only">{{ column.label }}</dt>
                  <dd :class="column.dlClass">{{ item[column.key] }}</dd>
                </template>
              </dl>
            </td>
            <td
              v-for="(column, colIdx) in columns.slice(1)"
              :key="column.key"
              :class="column.tdClass"
            >
              {{ item[column.key] }}
            </td>
            <td class="py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-0">
              <a href="#" class="text-primary-600 hover:text-primary-900">
                Edit<span class="sr-only">, {{ item[columns[0].key] }}</span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";

interface Column {
  key: string;
  label: string;
  thClass?: string;
  tdClass?: string;
  dlClass?: string;
}

interface Props {
  heading?: string;
  subheading?: string;
  buttonLabel?: string;
  columns: Column[];
  items: any[];
  rowKey?: string;
}

withDefaults(defineProps<Props>(), {
  heading: "Table",
  subheading: "A list of items.",
  buttonLabel: "",
  rowKey: "id",
});
</script>
