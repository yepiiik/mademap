import EditorModel from '../models/editor/EditorModel';
import { auth } from '../config/firebase';
import { isString } from 'lodash-es';


function cleanForNoSQL(obj) {
    const cleanedObj = {};

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

    updateBlock(blockId: string, content: Object) {
        const uid = auth.currentUser?.uid
        if (!uid) return
        if (!content) return
        if (!blockId) return

        const clearContent = cleanForNoSQL(content)

        this.model.updateContent(blockId, clearContent, uid);
    }

    getBlocks() {
        const uid = auth.currentUser?.uid
        if (!uid) return

        return this.model.getBlocks(uid)
    }

    createEmptyBlock() {
        const uid = auth.currentUser?.uid
        if (!uid) return

        return this.model.createEmptyBlock(uid)
    }

    deleteBlock(blockId) {
        const uid = auth.currentUser?.uid
        if (!uid) return
        if (!blockId) return

        return this.model.deleteBlock(blockId, uid)
    }
}