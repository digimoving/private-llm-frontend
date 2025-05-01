<template>
  <div>
    <div
      :class="{
        'space-y-2': showAsList,
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4': !showAsList,
      }"
    >
      <!-- Add Project Card - Using the actual component -->
      <AddNewResourceCard
        :show-as-list="showAsList"
        resource-type="project"
        @click="$emit('add-project')"
      />

      <!-- Project Card Skeletons -->
      <template v-for="i in 6" :key="i">
        <div
          v-if="showAsList"
          class="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <SkeletonLoader
                width="w-10"
                height="h-10"
                className="rounded-lg"
              />
              <div>
                <SkeletonLoader width="w-32" height="h-5" className="mb-2" />
                <SkeletonLoader width="w-48" height="h-4" />
              </div>
            </div>
            <SkeletonLoader width="w-8" height="h-8" className="rounded-full" />
          </div>
        </div>
        <div
          v-else
          class="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 h-[250px]"
        >
          <div class="flex flex-col h-full">
            <div class="flex items-start justify-between mb-4">
              <SkeletonLoader
                width="w-12"
                height="h-12"
                className="rounded-lg"
              />
              <SkeletonLoader
                width="w-8"
                height="h-8"
                className="rounded-full"
              />
            </div>
            <SkeletonLoader width="w-32" height="h-5" className="mb-2" />
            <SkeletonLoader width="w-full" height="h-4" className="mb-1" />
            <SkeletonLoader width="w-3/4" height="h-4" className="mb-4" />
            <div class="mt-auto">
              <SkeletonLoader
                width="w-full"
                height="h-8"
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonLoader from "../ui/SkeletonLoader.vue";
import AddNewResourceCard from "./AddNewResourceCard.vue";
defineProps<{
  showAsList: boolean;
}>();

defineEmits<{
  (e: "add-project"): void;
}>();
</script>
