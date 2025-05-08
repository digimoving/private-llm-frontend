<template>
  <div class="mt-8">
    <!-- Table for desktop -->
    <div
      class="hidden sm:block rounded-lg border border-gray-200 overflow-x-auto"
    >
      <table class="min-w-full table-fixed divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :class="[
                'py-3.5 text-sm font-semibold text-gray-900',
                col.key === 'time' || col.key === 'name' ? 'px-4' : 'px-3',
                col.align === 'center' ? 'text-center' : 'text-left',
              ]"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="item in items" :key="getItemKey(item)">
            <td
              v-for="col in columns"
              :key="col.key"
              :class="[
                'px-3 py-4 text-sm',
                col.key === 'time' || col.key === 'name'
                  ? 'px-4 font-medium text-gray-900'
                  : 'font-normal text-gray-500',
                col.align === 'center' ? 'text-center' : '',
              ]"
            >
              <slot :name="col.key" :item="item" :value="item[col.key]">
                <template v-if="col.render">
                  <component
                    :is="col.render"
                    :item="item"
                    :value="item[col.key]"
                  />
                </template>
                <template v-else>
                  {{ item[col.key] }}
                </template>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table for mobile -->
    <div class="sm:hidden space-y-4">
      <div
        v-for="item in items"
        :key="getItemKey(item)"
        class="bg-white shadow rounded-lg p-4 flex flex-col gap-2"
      >
        <template v-for="col in columns" :key="col.key">
          <div
            v-if="!col.hideOnMobile && col.key !== 'prompt'"
            :class="'flex justify-between items-center text-xs '"
          >
            <span class="font-medium text-gray-900">{{ col.label }}</span>
            <span class="font-normal text-gray-500">
              <slot :name="col.key" :item="item" :value="item[col.key]">
                <template v-if="col.render">
                  <component
                    :is="col.render"
                    :item="item"
                    :value="item[col.key]"
                  />
                </template>
                <template v-else>
                  {{ item[col.key] }}
                </template>
              </slot>
            </span>
          </div>
          <!-- Special handling for prompt on mobile -->
          <div
            v-if="col.key === 'prompt'"
            class="text-xs text-gray-900 mt-1 break-words whitespace-pre-line"
          >
            <span class="font-medium">{{ col.label }}</span>
            <slot name="promptMobile" :value="item[col.key]">
              {{ item[col.key] }}
            </slot>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  hideOnMobile?: boolean;
  render?: any; // Component to render for this column
}

interface Props {
  items: any[];
  columns: Column[];
  itemKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  itemKey: "id",
});

const getItemKey = (item: any) => {
  return item[props.itemKey];
};
</script>
