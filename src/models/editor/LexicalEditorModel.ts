import EditorModel from "./EditorModel.ts";

import { db } from "../../config/firebase.js";
import { addDoc, updateDoc, query, getDoc, deleteDoc, getDocs, doc, where, collection, Timestamp } from "firebase/firestore"; 


export default class LexicalEditorModel extends EditorModel {
    async getBlock(blockId: string, authorID: any) {
        const docRef = doc(db, 'blocks', blockId);
        
        // Get the document that match the query
        const docSnapshot = await getDoc(docRef);

        return {
            id: docSnapshot.id,
            ...docSnapshot.data()
        }       

    }
    async deleteBlock(blockId: string, authorID: string) {
        const docRef = doc(db, 'blocks', blockId);

        await deleteDoc(docRef)

        return true
    }
    async createEmptyBlock(authorID: string) {
        const collectionRef = collection(db, 'blocks'); // Replace with your actual collection name
        
        const data = {
            author: authorID,
            content: Object(),
            createdAt: Timestamp.now()
        }

        const newBlockRef = await addDoc(collectionRef, data);

        return this.getBlock(newBlockRef.id, authorID);
    }

    async getBlocks(authorID: string) {
        // Reference the collection
        const collectionRef = collection(db, 'blocks'); // Replace with your actual collection name

        // Query to find document(s) where "author" is "astrid"
        const q = query(collectionRef, where("author", "==", authorID));

        // Get the documents that match the query
        const querySnapshot = await getDocs(q);

        // Convert QuerySnapshot to array of documents
        const docsArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,          // Document ID
            ...doc.data()        // Spread document data
        }));

        // console.log(docsArray);
        return docsArray;
    }
    async updateContent(blockId: string, content: Object, authorID: string) {
        const docRef = doc(db, 'blocks', blockId);
        const collectionRef = collection(db, 'blocks')

        // Get the document that match the query
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
            // If no document found, insert a new document
            await addDoc(collectionRef, {
                author: authorID,
                content: Object(content)
            });
            console.log(`New document inserted for author ${authorID}`);
        } else {
            await updateDoc(docRef, {
                content: content
            });
            console.log(`Document with ID ${docSnapshot.id} updated successfully`);
        }
    }

}