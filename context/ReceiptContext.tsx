import { extractReceiptItems, ReceiptItem } from "@/utils/pdf-splitting";
import { extractText, isAvailable } from "expo-pdf-text-extract";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ReceiptContextType {
  spliteeIds: Set<string>;
  addSplitee: (userId: string) => void;
  removeSplitee: (userId: string) => void;

  selectedFile: string | null;
  setSelectedFile: (file: string | null) => void;

  // Receipt items extracted from the PDF + raw extracted text
  rawExtractedText?: string;

  receiptItems: ReceiptItem[];
  updateItemById: (id: string, updatedItem: Partial<ReceiptItem>) => void;
  deleteItemById: (id: string) => void;

  setReceiptItems: React.Dispatch<React.SetStateAction<ReceiptItem[]>>;
  assignUserToItem: (userId: string, item: ReceiptItem) => void;
  unassignUserFromAnyItems: (userId: string) => void;

  extractItemsFromPdf: (pdfUri: string) => Promise<void>;
}

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export const ReceiptProvider = ({ children }: { children: ReactNode }) => {
  const [spliteeIds, setSpliteeIds] = useState<Set<string>>(new Set());
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

  useEffect(() => {
    if (selectedFile) {
      extractItemsFromPdf(selectedFile);
    }
  }, [selectedFile]);

  function addSplitee(userId: string) {
    setSpliteeIds((prev) => new Set(prev).add(userId));
  }

  function removeSplitee(userId: string) {
    const newSet = new Set(spliteeIds);
    newSet.delete(userId);
    setSpliteeIds(newSet);
  }

  function unassignUserFromAnyItems(userId: string) {
    const updated = receiptItems.map((item) => {
      if (item.assignedUserIds.has(userId)) {
        const updatedAssignedUserIds = new Set(item.assignedUserIds);
        updatedAssignedUserIds.delete(userId);
        return { ...item, assignedUserIds: updatedAssignedUserIds };
      }

      return item;
    });

    setReceiptItems(updated);
  }

  function assignUserToItem(userId: string, item: ReceiptItem) {
    const updatedItems = receiptItems.map((item) => {
      if (item.id !== item.id || item.assignedUserIds.has(userId)) {
        return item;
      }

      const updatedAssignedUserIds = new Set(item.assignedUserIds);
      updatedAssignedUserIds.add(userId);

      return { ...item, assignedUserIds: updatedAssignedUserIds };
    });

    setReceiptItems(updatedItems);
  }

  function updateItemById(id: string, updatedItem: Partial<ReceiptItem>) {
    setReceiptItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item,
      ),
    );
  }

  function deleteItemById(id: string) {
    setReceiptItems((items) => items.filter((item) => item.id !== id));
  }

  return (
    <ReceiptContext.Provider
      value={{
        spliteeIds,
        addSplitee,
        removeSplitee,

        selectedFile,
        setSelectedFile,
        assignUserToItem,
        unassignUserFromAnyItems,

        receiptItems,
        setReceiptItems,
        updateItemById,
        deleteItemById,
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
