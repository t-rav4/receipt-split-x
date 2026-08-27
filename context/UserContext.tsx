import { User } from "@/types/user";
import { deleteUserById, getUsers, saveUsers } from "@/utils/user";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  deleteUser: (userId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const loadedUsers = await getUsers();
      setUsers(loadedUsers);
    };

    loadUsers();
  }, []);

  // Save users to SecureStore whenever they change
  useEffect(() => {
    if (users.length > 0) {
      saveUsers(users);
    }
  }, [users]);

  async function deleteUser(userId: string) {
    await deleteUserById(userId);
    setUsers((prevUsers) =>
      prevUsers.filter((user: User) => user.id !== userId),
    );
  }

  return (
    <UserContext.Provider value={{ users, setUsers, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
