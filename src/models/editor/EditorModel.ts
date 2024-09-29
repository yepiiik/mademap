export default abstract class EditorModel {
    abstract updateContent(blockId: string, content: Object, authorID: string)
    abstract getBlocks(authorID: string);
    abstract getBlock(blockId: string, authorID);
    abstract createEmptyBlock(authorID: string);
    abstract deleteBlock(blockId: string, authorID: string);
}