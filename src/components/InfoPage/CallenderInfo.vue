<!-- <template>
    <div>
        <FullCalendar :events="events" :options="options" />
    </div>
</template>


<script lang="ts">
import { ref, onMounted } from 'vue';
import '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
    setup() {
        onMounted(() => {
            eventService.value.getEvents().then(data => events.value = data);
        })

        const options =  ref({
            plugins:[dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialDate : '2017-02-01',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            editable: true,
                selectable:true, 
                selectMirror: true, 
                dayMaxEvents: true
        });
        const events =  ref(null);
        const eventService = ref(new EventService());

        return { options, events, eventService };
    }
}
</script>

<style scoped>
@media screen and (max-width: 960px) {
    ::v-deep(.fc-header-toolbar) {
        display: flex;
        flex-wrap: wrap;
    }
}
</style> -->