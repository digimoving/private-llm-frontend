# UI Components Documentation

This directory contains reusable UI components for the application. Below is a detailed documentation of each component, its props, and usage examples.

## Button

A versatile button component with multiple variants, sizes, and states.

### Props

| Prop     | Type                                                     | Default   | Description                       |
| -------- | -------------------------------------------------------- | --------- | --------------------------------- |
| variant  | 'primary' \| 'secondary' \| 'danger' \| 'flat' \| 'icon' | 'primary' | Button style variant              |
| size     | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'                     | 'md'      | Button size                       |
| icon     | FunctionalComponent                                      | undefined | Optional icon component           |
| text     | string                                                   | undefined | Button text (alternative to slot) |
| block    | boolean                                                  | false     | Makes button full width           |
| disabled | boolean                                                  | false     | Disables the button               |
| type     | 'button' \| 'submit' \| 'reset'                          | 'button'  | HTML button type                  |
| loading  | boolean                                                  | false     | Shows loading spinner             |

### Usage Example

```vue
<Button
  variant="primary"
  size="md"
  :icon="PlusIcon"
  text="Add Item"
  :loading="isLoading"
  @click="handleClick"
/>
```

## Input

A form input component with validation and error states.

### Props

| Prop         | Type             | Default   | Description                            |
| ------------ | ---------------- | --------- | -------------------------------------- |
| modelValue   | string \| number | ''        | v-model value                          |
| type         | string           | 'text'    | Input type (text, number, email, etc.) |
| label        | string           | undefined | Input label                            |
| placeholder  | string           | undefined | Placeholder text                       |
| error        | string           | undefined | Error message                          |
| disabled     | boolean          | false     | Disables the input                     |
| required     | boolean          | false     | Marks input as required                |
| autocomplete | string           | undefined | HTML autocomplete attribute            |

### Usage Example

```vue
<Input
  v-model="email"
  type="email"
  label="Email"
  placeholder="Enter your email"
  :error="emailError"
  required
/>
```

## Modal

A modal dialog component for displaying content in an overlay.

### Props

| Prop            | Type                         | Default   | Description                         |
| --------------- | ---------------------------- | --------- | ----------------------------------- |
| isOpen          | boolean                      | false     | Controls modal visibility           |
| title           | string                       | undefined | Modal title                         |
| size            | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md'      | Modal size                          |
| closeOnBackdrop | boolean                      | true      | Closes modal when clicking backdrop |

### Events

| Event | Description                  |
| ----- | ---------------------------- |
| close | Emitted when modal is closed |

### Usage Example

```vue
<Modal
  :is-open="showModal"
  title="Edit Item"
  size="md"
  @close="showModal = false"
>
  <template #default>
    <!-- Modal content -->
  </template>
  <template #footer>
    <!-- Modal footer content -->
  </template>
</Modal>
```

## Table

A data table component with sorting and pagination.

### Props

| Prop          | Type                                                      | Default   | Description              |
| ------------- | --------------------------------------------------------- | --------- | ------------------------ |
| columns       | Array<{ key: string, label: string, sortable?: boolean }> | []        | Table column definitions |
| data          | Array<any>                                                | []        | Table data               |
| loading       | boolean                                                   | false     | Shows loading state      |
| sortBy        | string                                                    | undefined | Current sort column      |
| sortDirection | 'asc' \| 'desc'                                           | undefined | Sort direction           |

### Events

| Event | Description                   |
| ----- | ----------------------------- |
| sort  | Emitted when column is sorted |

### Usage Example

```vue
<Table
  :columns="columns"
  :data="items"
  :loading="isLoading"
  :sort-by="sortBy"
  :sort-direction="sortDirection"
  @sort="handleSort"
/>
```

## Card

A container component for grouping related content.

### Props

| Prop    | Type    | Default   | Description                  |
| ------- | ------- | --------- | ---------------------------- |
| title   | string  | undefined | Card title                   |
| padding | boolean | true      | Adds padding to card content |

### Usage Example

```vue
<Card title="User Profile">
  <!-- Card content -->
</Card>
```

## Chip

A small component for displaying labels or tags.

### Props

| Prop    | Type                                                          | Default   | Description        |
| ------- | ------------------------------------------------------------- | --------- | ------------------ |
| variant | 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' | 'primary' | Chip style variant |
| size    | 'sm' \| 'md'                                                  | 'md'      | Chip size          |

### Usage Example

```vue
<Chip variant="success" size="sm">Active</Chip>
```

## LoadingSpinner

A component that displays a loading animation.

### Props

| Prop  | Type                 | Default        | Description   |
| ----- | -------------------- | -------------- | ------------- |
| size  | 'sm' \| 'md' \| 'lg' | 'md'           | Spinner size  |
| color | string               | 'currentColor' | Spinner color |

### Usage Example

```vue
<LoadingSpinner size="md" color="#000000" />
```

## SkeletonLoader

A component that shows a loading skeleton animation.

### Props

| Prop   | Type                          | Default | Description                 |
| ------ | ----------------------------- | ------- | --------------------------- |
| type   | 'text' \| 'image' \| 'avatar' | 'text'  | Type of skeleton to display |
| width  | string                        | '100%'  | Width of the skeleton       |
| height | string                        | '1rem'  | Height of the skeleton      |

### Usage Example

```vue
<SkeletonLoader type="text" width="200px" height="1.5rem" />
```

## Menu

A dropdown menu component.

### Props

| Prop     | Type                                         | Default | Description                       |
| -------- | -------------------------------------------- | ------- | --------------------------------- |
| items    | Array<{ label: string, action: () => void }> | []      | Menu items                        |
| position | 'left' \| 'right'                            | 'right' | Menu position relative to trigger |

### Usage Example

```vue
<Menu :items="menuItems" position="right" />
```

## ActionMenu

A menu component specifically for actions, with icons and dividers.

### Props

| Prop  | Type                                                                              | Default | Description                                 |
| ----- | --------------------------------------------------------------------------------- | ------- | ------------------------------------------- |
| items | Array<{ label: string, icon?: Component, action: () => void, divider?: boolean }> | []      | Menu items with optional icons and dividers |

### Usage Example

```vue
<ActionMenu
  :items="[
    { label: 'Edit', icon: PencilIcon, action: handleEdit },
    { divider: true },
    { label: 'Delete', icon: TrashIcon, action: handleDelete },
  ]"
/>
```

## Form

A form component that handles validation and submission.

### Props

| Prop       | Type                | Default  | Description        |
| ---------- | ------------------- | -------- | ------------------ |
| modelValue | Record<string, any> | {}       | Form data object   |
| schema     | Object              | {}       | Validation schema  |
| submitText | string              | 'Submit' | Submit button text |
| cancelText | string              | 'Cancel' | Cancel button text |

### Events

| Event  | Description                    |
| ------ | ------------------------------ |
| submit | Emitted when form is submitted |
| cancel | Emitted when form is cancelled |

### Usage Example

```vue
<Form
  v-model="formData"
  :schema="validationSchema"
  submit-text="Save"
  @submit="handleSubmit"
  @cancel="handleCancel"
>
  <!-- Form fields -->
</Form>
```
