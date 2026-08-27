import { User } from "@/types/user";
import * as SecureStore from "expo-secure-store";

export async function getUsers() {
  const result = await SecureStore.getItemAsync("users");
  if (result) {
    return JSON.parse(result);
  }
  return [];
}

export async function saveUsers(users: User[]) {
  await SecureStore.setItemAsync("users", JSON.stringify(users));
}

export async function deleteUserById(userId: string): Promise<void> {
  let users = await getUsers();
  users = users.filter((user: User) => user.id !== userId);
  await saveUsers(users);
}
