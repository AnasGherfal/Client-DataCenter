<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Selected Time: {{ selectedTime }}</p>
    <Calendar :value="selectedDate" @date-select="handleDateSelect" />
    <Dialog v-model="dialogVisible">
      <h3>Edit Time</h3>
      <InputTime v-model="editedTime" />
      <div class="p-dialog-footer">
        <Button label="Cancel" @click="closeDialog" />
        <Button label="Save" @click="saveTime" />
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import axios from 'axios';

interface TimeData {
  time: string;
}

export default defineComponent({
  name: 'CalendarComponent',
  setup() {
    const state = reactive({
      title: 'Calendar',
      selectedDate: new Date(),
      selectedTime: '',
      dialogVisible: false,
      editedTime: '',
    });

    const loadData = async () => {
      const response = await axios.get<TimeData>('http://localhost:3000/visitHours');
      state.selectedTime = response.data.time;
    };

    const handleDateSelect = (event: { originalEvent: MouseEvent; value: Date }) => {
      state.selectedDate = event.value;
      state.dialogVisible = true;
    };

    const closeDialog = () => {
      state.dialogVisible = false;
    };

    const saveTime = async () => {
      const newData = { time: state.editedTime };
      await axios.patch('http://localhost:3000/visitHours', newData);
      state.selectedTime = state.editedTime;
      state.dialogVisible = false;
    };

    loadData();

    return {
      ...state,
      handleDateSelect,
      closeDialog,
      saveTime,
    };
  },
});
</script>