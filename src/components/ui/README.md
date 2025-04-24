# UI Components – Private LLM

This folder contains shared UI components used across the Private LLM interface.  
They are built with Vue 3, `<script setup>`, TypeScript, and Tailwind CSS v4 using a CSS-first approach.

All design tokens (colors, fonts, spacing) are defined in the `@theme` block in `global.css`.

---

## <Button />

A reusable button component with consistent variants and sizing.

### Props

- `variant` (string) — `'primary' | 'secondary' | 'danger'`  
  Defines the button style. Default: `'primary'`.

- `size` (string) — `'xs' | 'sm' | 'md' | 'lg' | 'xl'`  
  Adjusts padding, font size, and rounding. Default: `'md'`.

- `icon` (Vue functional component) — optional  
  Displays an icon to the left of the button text.

- `block` (boolean) — optional  
  Makes the button full-width.

- `disabled` (boolean) — optional  
  Disables the button and adjusts visual styling.

- `type` (string) — `'button' | 'submit' | 'reset'`  
  Default: `'button'`.

- `loading` (boolean) — optional
  Shows loading spinner when true.

### Example usage

```vue
<Button>Submit</Button>

<Button variant="secondary">Cancel</Button>

<Button variant="danger" size="lg" :icon="TrashIcon">Delete</Button>

<Button size="xl" block>Continue</Button>

<Button :icon="PlusIcon" @click="handleClick">Add Item</Button>
```

### Notes

- All components use <script setup> and TypeScript.

- Icons are passed as FunctionalComponents (usually from @heroicons/vue).

- Colour variants should use @theme variables like primary, success etc. but allow overrides if needed.

- You can extend this button with loading, iconRight, or as="a" for link buttons.
