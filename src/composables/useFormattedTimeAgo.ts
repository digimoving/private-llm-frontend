import { computed, type MaybeRefOrGetter } from "vue";
import { useTimeAgo } from "@vueuse/core";

export function useFormattedTimeAgo(
  time: MaybeRefOrGetter<Date | number | string>
) {
  const timeAgo = useTimeAgo(time);

  return computed(() => {
    const rawTimeAgo = timeAgo.value;

    // Handle "last year" case
    if (rawTimeAgo === "last year") {
      return "over a year ago";
    }

    // Check if it contains "years"
    if (rawTimeAgo.includes("years")) {
      const match = rawTimeAgo.match(/(\d+)\s+years/);
      if (match) {
        const years = parseInt(match[1]);
        return `over ${years} years ago`;
      }
    }

    return rawTimeAgo;
  });
}
