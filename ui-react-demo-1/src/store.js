// store.js
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';  // Import devtools extension
import rootReducer from './rootReducer';

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))  // Add devtools to middleware
);

export default store;
