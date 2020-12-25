import "./styles.css";
import {App} from './app'

const appContainer = document.getElementById("app")
const myApp = new App(appContainer)

myApp.init()
