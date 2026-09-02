import { User } from "@/types/user";
import { deleteUserById, getUsers, saveUsers } from "@/utils/user";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  users: User[];

  createUser: (name: string) => User;
  updateUser: (userId: string, updatedUser: Partial<User>) => Promise<void>;
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

  function createUser(name: string) {
    const randomColour = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;
    const newUser: User = {
      id: Date.now().toString(), // TODO: replace with UUID or some other unique identifier
      name,
      colour: randomColour,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    return newUser;
  }

  async function deleteUser(userId: string) {
    await deleteUserById(userId);
    setUsers((prevUsers) =>
      prevUsers.filter((user: User) => user.id !== userId),
    );
  }

  async function updateUser(userId: string, updatedUser: Partial<User>) {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...updatedUser } : user,
      ),
    );
  }

  return (
    <UserContext.Provider value={{ users, createUser, updateUser, deleteUser }}>
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
