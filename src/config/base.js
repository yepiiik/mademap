import FirebaseAuthModel from "../models/auth/FirebaseAuthModel.ts";
import AuthController from "../controllers/AuthController.ts";
import LexicalEditorModel from "../models/editor/LexicalEditorModel.ts";
import EditorController from "../controllers/EditorController.ts";

const firebaseAuthModel = new FirebaseAuthModel()
const lexicalEditorModel = new LexicalEditorModel()

const authController = new AuthController(firebaseAuthModel);
const editorController = new EditorController(lexicalEditorModel);

const isDarkThemePrefered = window.matchMedia('(prefers-color-scheme: dark)').matches

export {authController, editorController, isDarkThemePrefered}