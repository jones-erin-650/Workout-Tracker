<script setup lang="ts">
  import {  ref } from 'vue';
  import { filterFriendActivities } from '@/model/User'
  import { refSession } from '@/viewModel/session'
  import ActivityPost from '@/components/Activity-Components/ActivityPost.vue';
  import { getActivities, type Activity } from '@/model/Activity';
  import UserTypeHead from '@/components/User-Components/UserTypeahead.vue';
import UserTypeahead from '@/components/User-Components/UserTypeahead.vue';
    
  // want to first import the current user using refSession
  const session = refSession()

  // import current user for the filter logic


  // import activities array
  const activities = ref([] as Activity[])
  const activityDataResponse = await getActivities()
  const activityDataEnvelope = await activityDataResponse
  activities.value = activityDataEnvelope!.data as Activity[]

  console.log('activities in MyActivity: ' + JSON.stringify(activities.value));

  // should definitely be a function but unfortunately im lazy right now
  const filteredActivities = filterFriendActivities(session.user!, activities.value)

  


  
</script>
<template>
  <Suspense>
    <div>
      <UserTypeahead />
      <hr>

      <ActivityPost v-for="activity in filteredActivities" :key="activity.id"
        :activity="activity"
      />
      <hr>
    </div>
  </Suspense>
</template>