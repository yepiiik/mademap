import EditorModel from '../models/editor/EditorModel';
import { auth } from '../config/firebase';


function cleanForNoSQL(obj: any) {
    const cleanedObj: Record<string, any> = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            // Check if the value is valid for Firestore/MongoDB
            if (
                value !== undefined &&
                value !== null &&
                typeof value !== 'function' &&
                typeof value !== 'symbol' &&
                !Number.isNaN(value) &&
                value !== Infinity &&
                value !== -Infinity
            ) {
                // Handle complex objects
                if (typeof value === 'object') {
                    // Recursively clean nested objects
                    cleanedObj[key] = Array.isArray(value)
                        ? value.map(v => cleanForNoSQL(v))  // Clean arrays recursively
                        : cleanForNoSQL(value);             // Clean plain objects recursively
                } else {
                    // Directly assign valid primitive values
                    cleanedObj[key] = value;
                }
            }
        }
    }
    return cleanedObj;
}

export default class EditorController {
    model: EditorModel

    constructor(model: EditorModel) {
        this.model = model;
    }

    updateBlock(blockId: string, content: string) {
        const uid = auth.currentUser?.uid
        if (!uid) return
        if (content === undefined || content === null) return
        if (!blockId) return

        this.model.updateContent(blockId, content, uid);
    }

    async getBlocks() {
        const uid = auth.currentUser?.uid
        if (!uid) {
            return []
        }

        return this.model.getBlocks(uid)
    }

    async createEmptyBlock(content = '') {
        const uid = auth.currentUser?.uid
        if (!uid) {
            return null
        }

        return this.model.createBlock(content, uid)
    }

    deleteBlock(blockId: string) {
        const uid = auth.currentUser?.uid
        if (!uid) return
        if (!blockId) return

        return this.model.deleteBlock(blockId, uid)
    }
}