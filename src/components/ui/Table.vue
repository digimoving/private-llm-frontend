<template>
  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle">
        <div
          class="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg bg-white"
        >
          <div class="overflow-y-auto max-h-[calc(100vh-12rem)]">
            <table
              class="min-w-full border-separate border-spacing-0 table-fixed"
            >
              <colgroup>
                <col
                  v-for="column in columns"
                  :key="column.key"
                  :style="column.width ? { width: column.width } : {}"
                />
              </colgroup>
              <thead>
                <tr>
                  <th
                    v-for="column in columns"
                    :key="column.key"
                    scope="col"
                    :style="
                      column.width
                        ? {
                            width: column.width,
                            minWidth: column.width,
                            maxWidth: column.width,
                          }
                        : {}
                    "
                    :class="[
                      'sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter',
                      column.key === firstColumn
                        ? 'pl-4 pr-3 sm:pl-6 lg:pl-8'
                        : 'px-3',
                      column.key === 'actions'
                        ? 'relative pr-4 pl-3 sm:pr-6 lg:pr-8'
                        : '',
                      column.hideOnMobile ? 'hidden sm:table-cell' : '',
                      column.hideOnTablet ? 'hidden lg:table-cell' : '',
                    ]"
                  >
                    {{ column.key === "actions" ? "" : column.label }}
                    <span v-if="column.key === 'actions'" class="sr-only"
                      >Actions</span
                    >
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-if="loading">
                  <tr v-for="n in 10" :key="'skeleton-' + n">
                    <td
                      v-for="column in columns"
                      :key="column.key"
                      :style="
                        column.width
                          ? {
                              width: column.width,
                              minWidth: column.width,
                              maxWidth: column.width,
                            }
                          : {}
                      "
                      :class="[
                        'py-4 text-sm',
                        column.key === firstColumn
                          ? 'pl-4 pr-3 sm:pl-6 lg:pl-8'
                          : 'px-3',
                        column.key === 'actions'
                          ? 'relative pr-4 pl-3 text-right sm:pr-6 lg:pr-8'
                          : '',
                        column.hideOnMobile ? 'hidden sm:table-cell' : '',
                        column.hideOnTablet ? 'hidden lg:table-cell' : '',
                        n !== 10 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap',
                      ]"
                    >
                      <div class="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="(item, itemIdx) in items" :key="itemIdx">
                    <td
                      v-for="column in columns"
                      :key="column.key"
                      :style="
                        column.width
                          ? {
                              width: column.width,
                              minWidth: column.width,
                              maxWidth: column.width,
                            }
                          : {}
                      "
                      :class="[
                        'py-4 text-sm',
                        column.key === firstColumn
                          ? 'pl-4 pr-3 sm:pl-6 lg:pl-8'
                          : 'px-3',
                        column.key === 'actions'
                          ? 'relative pr-4 pl-3 text-right sm:pr-6 lg:pr-8'
                          : '',
                        column.hideOnMobile ? 'hidden sm:table-cell' : '',
                        column.hideOnTablet ? 'hidden lg:table-cell' : '',
                        itemIdx !== items.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        typeof column.textColor === 'function'
                          ? column.textColor(item)
                          : column.textColor || 'text-gray-900',
                        column.key === firstColumn &&
                        (column.hideOnMobile || column.hideOnTablet)
                          ? 'w-full max-w-0 sm:w-auto sm:max-w-none'
                          : 'whitespace-nowrap',
                      ]"
                    >
                      <slot :name="column.key" :item="item" :column="column">
                        <template
                          v-if="
                            column.key === firstColumn &&
                            (column.hideOnMobile || column.hideOnTablet)
                          "
                        >
                          <div class="font-medium">{{ item[column.key] }}</div>
                          <dl class="font-normal lg:hidden">
                            <template
                              v-for="hiddenColumn in columns.filter(
                                (c) => c.hideOnMobile || c.hideOnTablet
                              )"
                              :key="hiddenColumn.key"
                            >
                              <dt
                                class="sr-only"
                                :class="{
                                  'sm:hidden': hiddenColumn.hideOnMobile,
                                }"
                              >
                                {{ hiddenColumn.label }}
                              </dt>
                              <dd
                                class="mt-1 truncate"
                                :class="[
                                  hiddenColumn.hideOnMobile ? 'sm:hidden' : '',
                                  typeof hiddenColumn.textColor === 'function'
                                    ? hiddenColumn.textColor(item)
                                    : hiddenColumn.textColor || 'text-gray-500',
                                ]"
                              >
                                {{ item[hiddenColumn.key] }}
                              </dd>
                            </template>
                          </dl>
                        </template>
                        <template v-else>
                          {{ item[column.key] }}
                        </template>
                      </slot>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <Pagination
            v-if="showPagination && paginationProps"
            v-bind="paginationProps"
            class="border-t border-gray-200 bg-white"
            @pageChange="$emit('pageChange', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Pagination from "./Pagination.vue";

interface Column {
  key: string;
  label: string;
  textColor?: string | ((item: any) => string);
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  width?: string;
}

interface Props {
  columns: Column[];
  items: any[];
  loading?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalItems?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showPagination: true,
});

// Only pass pagination props if all are provided
const paginationProps = computed(() => {
  if (
    props.currentPage !== undefined &&
    props.totalPages !== undefined &&
    props.pageSize !== undefined &&
    props.totalItems !== undefined
  ) {
    return {
      currentPage: props.currentPage,
      totalPages: props.totalPages,
      pageSize: props.pageSize,
      totalItems: props.totalItems,
    };
  }
  return null;
});

// Get the key of the first column for styling purposes
const firstColumn = props.columns[0]?.key;
</script>
