import React 		from 'react';
import ReactDom	from 'react-dom';
import registerServiceWorker from  "./registerServiceWorker";
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { Provider } from "react-redux";
import { LandingPage, Listings, NotFound, Login, Signup, ServiceProviders, ContactPage } from 'views';
import store from './store';
import 'css/App.css';

let mPoint = document.getElementById('root');

let LandingPageComponent = ()=>{
	return(
		<Provider store={store}>
			<LandingPage />
		</Provider>
	)
}

let ContactComponent = ()=>{
	return(
		<Provider store={store}>
			<ContactPage />
		</Provider>
	)
}

let ListingComponent = ()=>{
	return(
		<Provider store={store}>
			<Listings />
		</Provider>
	)
}

let ServiceProvidersComponent = ()=>{
	return(
		<Provider store={store}>
			<ServiceProviders />
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
					<Route exact path="/" component={ LandingPageComponent } />
					<Route exact path="/listings" component={ ListingComponent } />
					<Route exact path="/service-providers" component={ ServiceProvidersComponent } />
					<Route exact path="/contact" component={ ContactComponent } />
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