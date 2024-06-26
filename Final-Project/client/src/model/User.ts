import userData from "../../../server/data/users.json";
import { onMounted, ref } from "vue";
import { api } from "../viewModel/session";
import { getActivities, type Activity } from "./Activity";

// importing activities data from the server
const activitiesData = ref([] as Activity[])
const activityDataResponse = await getActivities()
const activityDataEnvelope = await activityDataResponse
activitiesData.value = activityDataEnvelope!.data as Activity[]

export interface User {
  id: number,
  firstName: string,
  lastName: string,
  handle: string,
  email: string,
  profilePicture: string,
  isAdmin: boolean,
  
}

// this is just a simple way to get an empty user template to add and edit new users
export const newUser = ref()
// to import to other files
export const refNewUser = () => newUser
// 
export const setRefNewUser = (input: User ) => {
  newUser.value = input
}

export const setEmptyUser = () => {
  const activityToSetNewUser: User = {
    id: 0,
    firstName: '',
    lastName: '',
    handle: '',
    email: '',
    profilePicture: '',
    isAdmin: false,
  }
  // replaces the current newActivity value with the empty one
  setRefNewUser(activityToSetNewUser)
}
  
//sends a request to the server to return the users from the json files
export function getUsers() {
  console.log('get users test: ' + api<User[]>('users'));
  return api<User[]>('users/');
}

// input a user and get a return of their activity array
export function filterUserActivities(user: User, activities: Activity[]) {
  // kind of a compromise; anything that uses this function still has to import the full activities themselves, but we don't have to duplicate the logic everywhere now. still would be better to have this function import the activities but doing it this way just lets us have one more place we don't have to bother with async functions
  return activities.filter( (item) =>  item.originalPoster === user.handle)
}

export function filterFriendActivities(user: User, activities: Activity[]) {
  // gets all the activities except the user's; this is used for getting data for FriendActivities
  return activities.filter( (item) =>  item.originalPoster != user.handle)
}

export async function getUserActivities(user: User) {
  // this should import the activities for whatever calls it to make there be less repeated code
  const filteredActivities = filterUserActivities(user, activitiesData.value)

  return filteredActivities
}

// this code should probably be moved to a folder in viewmodel

export async function getUserFromHandle(handle: String) {
  try {
    const response = await api(`users/${handle}`, null, "GET");

    console.log('getUserFromHandle response: ' + JSON.stringify(response));

    return response;
  } catch (error) {
      throw new Error('Failed to fetch user by handle');
  }
}


export async function addUser(user: User) {
  await api('users/', user, 'POST')
  
} 
export async function editUser(user: User, originalUserId: Number) {
  await api(`users/${originalUserId}`, user, 'PATCH')
  
} 

export async function deleteUser(userId: number) {
  await api(`users/${userId}`, null, "DELETE");
}

export async function typeaheadSearch(currentInputValue: String) {
  await api(`users/typeahead/${currentInputValue}`, null, "SEARCH");
}