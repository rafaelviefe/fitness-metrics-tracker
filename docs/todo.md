# Project Roadmap

[x] ID: 154: In the `Home` component, declare a new state variable `displayTime` and initialize it to `false` using `useState`.
[ ] ID: 155: In the `Home` component, pass the `displayTime` state variable as the `displayTime` prop to each `WeightStatisticsCard` instance.
[ ] ID: 156: In the `Home` component, pass the `displayTime` state variable as the `displayTime` prop to the `WeightRecordCard` component within the `map` function.
[ ] ID: 157: In the `Home` component, modify the `div` containing the unit preference `ToggleGroup` and "Clear All Records" `Button` to also contain a new `ToggleGroup` component for `displayTime`, setting its `type` to "single" and adding appropriate `className` for layout.
[ ] ID: 158: Inside the new `displayTime` `ToggleGroup` component in `Home`, add two `ToggleGroupItem` components: one with `value="false"` and children "Date Only", and another with `value="true"` and children "Date & Time".
[ ] ID: 159: In the `Home` component, set the `value` prop of the `displayTime` `ToggleGroup` to `displayTime.toString()`. Implement the `onValueChange` handler for this `ToggleGroup` to update the `displayTime` state by converting the incoming string `value` from the `ToggleGroupItem` to a boolean.