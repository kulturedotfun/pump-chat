/**
 * File: /lib/chatUtils.ts
 * 
 * Description:
 * - Utility functions for chat operations.
 * - Ensures only authenticated users can send messages.
 */

import { ref, push } from "firebase/database";
import { auth, realtimeDB } from "@/lib/firebaseConfig";
import { PublicKey } from "@solana/web3.js";

export const sendMessage = async (
  contractAddress: string,
  publicKey: PublicKey,
  newMessage: string
) => {
  if (!newMessage.trim()) {
    alert("Cannot send an empty message!");
    return;
  }

  if (!publicKey) {
    alert("Please connect your wallet to send messages.");
    return;
  }

  const currentUser = auth.currentUser; // ✅ Check Firebase auth state

  if (!currentUser) {
    alert("You must be authenticated to send messages.");
    return;
  }

  const chatRef = ref(realtimeDB, `chats/${contractAddress}/messages`);
  const messageData = {
    sender: publicKey.toBase58(),
    message: newMessage,
    timestamp: Date.now(),
  };

  try {
    await push(chatRef, messageData);
    console.log("✅ Message sent successfully!");
  } catch (error) {
    console.error("❌ Error sending message:", error);
    alert("Failed to send message.");
  }
};
