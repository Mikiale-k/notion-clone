'use server'

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server"

export async function createNewDocument() {
    auth.protect();

    const { sessionClaims } = await auth();

    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Doc",
    })

    await adminDb.collection("users")
        .doc(sessionClaims?.email)
        .collection("rooms")
        .doc(docRef.id)
        .set({
            userId: sessionClaims?.email,
            role: "owner",
            createAt: new Date(),
            roomId: docRef.id
        })
    return { docId: docRef.id }
}

export async function deleteDocument(roomId: string) {
    auth.protect();

    try {
        console.log("Deleting document:", roomId);

        // Delete the main document reference
        await adminDb.collection("documents").doc(roomId).delete();

        // Query for all related room documents
        const query = await adminDb.collectionGroup("rooms").where("roomId", "==", roomId).get();
        const batch = adminDb.batch();

        // Delete all room references
        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        // Delete from liveblocks
        await liveblocks.deleteRoom(roomId);

        return { success: true };
    } catch (error) {
        console.error("Error deleting document:", error);
        return { success: false, message: "Failed to delete document." };
    }
}
