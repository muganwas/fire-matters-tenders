import React 		from 'react';
import ReactDom	from 'react-dom';
import registerServiceWorker from  "./registerServiceWorker";
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from "react-redux";
import App from './App';
import NotFound from './components/NotFound';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import store from './store';

let mPoint = document.getElementById('root');

let mainComponent = ()=>{
	return(
		<Provider store={store}>
			<App/>
		</Provider>
	)
}

let loginComponent = ()=>{
	return(
		<Provider store={store}>
			<Login/>
		</Provider>
	)
}

let signupComponent = ()=>{
	return(
		<Provider store={store}>
			<Signup/>
		</Provider>
	)
}

let notFound = ()=>{
	return(
		<Provider store={store}>
			<NotFound/>
		</Provider>
	)
}

let Root = ()=>{
	return(
		<BrowserRouter basename = "/" >
			<div className="main">
				<Switch>
					<Route exact path="/" component={ mainComponent } />
					<Route exact path="/login" component={ loginComponent } />
					<Route exact path="/signup" component={ signupComponent } />
					<Route component={ notFound } />
				</Switch>
			</div>
		</BrowserRouter>
	)
}
ReactDom.render(
	<Root/>,mPoint
)
registerServiceWorker();