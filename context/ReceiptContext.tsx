import { User } from "@/types/user";
import { extractReceiptItems, ReceiptItem } from "@/utils/pdf-splitting";
import { extractText, isAvailable } from "expo-pdf-text-extract";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface ReceiptContextType {
  selectedFile: string | null;
  setSelectedFile: (file: string | null) => void;

  // Receipt items extracted from the PDF + raw extracted text
  rawExtractedText?: string;

  receiptItems: ReceiptItem[];
  setReceiptItems: React.Dispatch<React.SetStateAction<ReceiptItem[]>>;
  assignUserToItem: (user: User, item: ReceiptItem) => void;

  extractItemsFromPdf: (pdfUri: string) => Promise<void>;
}

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export const ReceiptProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
  const [rawExtractedText, setRawExtractedText] = useState<string>("");

  async function extractItemsFromPdf(pdfUri: string) {
    if (!isAvailable()) {
      console.warn("PDF text extraction is not available on this platform.");
      return;
    }
    const text = await extractText(pdfUri);
    setRawExtractedText(text);

    const processedText = extractReceiptItems(text);
    setReceiptItems(processedText);
  }

  function assignUserToItem(user: User, item: ReceiptItem) {
    const updatedItems = receiptItems.map((receiptItem) => {
      if (receiptItem.name !== item.name) return receiptItem;

      // Toggle the user between assigned and unassigned
      const updatedAssignedUsers = receiptItem.assignedUsers
        ? [...receiptItem.assignedUsers]
        : [];

      const userIndex = updatedAssignedUsers.findIndex(
        (assignedUser) => assignedUser.id === user.id,
      );

      if (userIndex !== -1) {
        // Remove user if already assigned
        updatedAssignedUsers.splice(userIndex, 1);
      } else {
        // Add user if not already assigned
        updatedAssignedUsers.push(user);
      }

      return { ...receiptItem, assignedUsers: updatedAssignedUsers };
    });

    setReceiptItems(updatedItems);
  }

  return (
    <ReceiptContext.Provider
      value={{
        selectedFile,
        setSelectedFile,
        receiptItems,
        assignUserToItem,

        setReceiptItems,
        rawExtractedText,
        extractItemsFromPdf,
      }}
    >
      {children}
    </ReceiptContext.Provider>
  );
};

export const useReceiptContext = () => {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error("useReceiptContext must be used within a ReceiptProvider");
  }
  return context;
};
